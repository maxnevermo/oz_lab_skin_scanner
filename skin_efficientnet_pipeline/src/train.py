from __future__ import annotations
import argparse
import json
import os
import random
import time
import numpy as np
import tensorflow as tf
from common import BEST_MODEL, CLASSES, DATA_DIR, RUN_DIR, inspect_dataset
from data import balanced_class_weights, load_splits
from evaluate import evaluate
from export_tflite import export
from model import build_model
from training_progress import TrainingProgress


def main():
    parser = argparse.ArgumentParser(description="Reproduce the published EfficientNetB0 training pipeline")
    parser.add_argument("--epochs", type=int, default=60)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=0.0001)
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Our chosen seed: author's notebook does not specify one",
    )
    parser.add_argument("--skip-evaluation", action="store_true")
    parser.add_argument("--skip-export", action="store_true")

    args = parser.parse_args()

    if args.epochs < 1 or args.batch_size < 1 or args.learning_rate <= 0:
        parser.error("--epochs, --batch-size, and --learning-rate must be positive")

    stats = inspect_dataset(DATA_DIR)
    train_image_count = sum(stats["train"].values())
    print("Class order:", list(CLASSES))
    print("Training distribution:", stats["train"])

    weights = balanced_class_weights(stats["train"])
    print("Class weights:", weights)

    random.seed(args.seed)
    np.random.seed(args.seed)
    tf.keras.utils.set_random_seed(args.seed)

    datasets = load_splits(batch_size=args.batch_size, seed=args.seed)

    model = build_model(learning_rate=args.learning_rate)
    model.summary()

    RUN_DIR.mkdir(parents=True, exist_ok=True)
    (RUN_DIR / "class_names.json").write_text(json.dumps(list(CLASSES), indent=2), encoding="utf-8")

    config = {
        "source": "https://github.com/Anshchauhanhub/Acne-Analysis-Model/blob/main/model.ipynb",
        "seed": args.seed,
        "epochs": args.epochs,
        "batch_size": args.batch_size,
        "learning_rate": args.learning_rate,
        "training_images": train_image_count,
        "class_counts": stats["train"],
        "class_weights": weights,
        "input_shape": [150, 150, 3],
        "tensorflow_version": tf.__version__,
        "cpu_count": os.cpu_count(),
        "accelerators": [
            device.name
            for device in tf.config.list_physical_devices()
            if device.device_type != "CPU"
        ],
        "parallel_data_pipeline": (
            "tf.data AUTOTUNE map + prefetch"
        ),
    }

    config_path = RUN_DIR / "run_config.json"
    config_path.write_text(json.dumps(
            config,
            indent=2,
        ),
        encoding="utf-8",
    )

    operations_log = (RUN_DIR / "operations.jsonl")
    operations_log.write_text("", encoding="utf-8")

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            str(BEST_MODEL),
            monitor="val_loss",
            save_best_only=True,
            mode="min",
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_accuracy",
            factor=0.8,
            patience=5,
            min_lr=1e-7,
            verbose=1,
        ),
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=30, restore_best_weights=True),
        tf.keras.callbacks.CSVLogger(str(RUN_DIR / "training_log.csv")),
        TrainingProgress(train_image_count, args.batch_size, operations_log),
    ]

    print("Starting training; first run may download ImageNet initialization weights.")

    training_started = time.perf_counter()

    history = model.fit(
        datasets["train"],
        epochs=args.epochs,
        validation_data=datasets["valid"],
        class_weight=weights,
        callbacks=callbacks,
        verbose=0,
    )

    config["training_duration_seconds"] = (
        time.perf_counter()
        - training_started
    )
    config_path.write_text(json.dumps(config, indent=2), encoding="utf-8")

    (RUN_DIR / "history.json").write_text(
        json.dumps(
            {
                key: [float(value) for value in values]
                for key, values in history.history.items()
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    if not BEST_MODEL.is_file():
        raise RuntimeError("Training finished without writing best_model.keras")

    print(f"Best validation-loss model: {BEST_MODEL}")

    if not args.skip_evaluation:
        evaluate(BEST_MODEL)

    if not args.skip_export:
        export(BEST_MODEL)

    print("DONE. Compare your model with the reference BEFORE replacing backend weights.")


if __name__ == "__main__":
    main()
