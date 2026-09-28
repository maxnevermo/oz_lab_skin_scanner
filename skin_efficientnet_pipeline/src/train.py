from __future__ import annotations
import argparse
import json
import random
import numpy as np
import tensorflow as tf
from common import BEST_MODEL, CLASSES, DATA_DIR, RUN_DIR, inspect_dataset
from data import balanced_class_weights, load_splits
from evaluate import evaluate
from export_tflite import export
from model import build_model


def main():
    parser = argparse.ArgumentParser(description="Reproduce the published EfficientNetB0 training pipeline")
    parser.add_argument("--epochs", type=int, default=60)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Our chosen seed: author's notebook does not specify one",
    )
    parser.add_argument("--skip-evaluation", action="store_true")
    parser.add_argument("--skip-export", action="store_true")

    args = parser.parse_args()

    if args.epochs < 1 or args.batch_size < 1:
        parser.error("--epochs and --batch-size must be positive")

    stats = inspect_dataset(DATA_DIR)
    print("Class order:", list(CLASSES))

    weights = balanced_class_weights(stats["train"])
    print("Class weights:", weights)

    random.seed(args.seed)
    np.random.seed(args.seed)
    tf.keras.utils.set_random_seed(args.seed)

    datasets = load_splits(batch_size=args.batch_size, seed=args.seed)

    model = build_model()
    model.summary()

    RUN_DIR.mkdir(parents=True, exist_ok=True)
    (RUN_DIR / "class_names.json").write_text(json.dumps(list(CLASSES), indent=2), encoding="utf-8")
    (RUN_DIR / "run_config.json").write_text(
        json.dumps(
            {
                "source": "https://github.com/Anshchauhanhub/Acne-Analysis-Model/blob/main/model.ipynb",
                "seed": args.seed,
                "epochs": args.epochs,
                "batch_size": args.batch_size,
                "class_weights": weights,
                "input_shape": [150, 150, 3],
                "tensorflow_version": tf.__version__,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

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
    ]

    print("Starting training; first run may download ImageNet initialization weights.")

    history = model.fit(
        datasets["train"],
        epochs=args.epochs,
        validation_data=datasets["valid"],
        class_weight=weights,
        callbacks=callbacks,
    )
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
