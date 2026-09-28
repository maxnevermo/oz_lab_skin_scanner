from __future__ import annotations
import json
import sys
from pathlib import Path
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from common import BEST_MODEL, CLASSES, RUN_DIR, inspect_dataset
from data import load_splits


def evaluate(model_path: Path = BEST_MODEL) -> dict:
    inspect_dataset(splits=("test",))

    if not model_path.is_file():
        raise FileNotFoundError(f"Model not found: {model_path}. Run train.py first.")

    model = tf.keras.models.load_model(model_path, compile=False)
    test_ds = load_splits(splits=("test",))["test"]

    truth = []
    predicted = []

    for images, labels in test_ds:
        outputs = model(images, training=False).numpy()

        batch_truth = np.argmax(labels.numpy(), axis=1)
        batch_predicted = np.argmax(outputs, axis=1)

        truth.extend(batch_truth.tolist())
        predicted.extend(batch_predicted.tolist())

    report = classification_report(
        truth,
        predicted,
        labels=list(range(len(CLASSES))),
        target_names=list(CLASSES),
        output_dict=True,
        zero_division=0,
    )
    matrix = confusion_matrix(truth, predicted, labels=list(range(len(CLASSES))))

    RUN_DIR.mkdir(parents=True, exist_ok=True)

    metrics = {
        "class_order": list(CLASSES),
        "report": report,
        "confusion_matrix": matrix.tolist(),
    }

    (RUN_DIR / "test_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    print("TEST classification report:")
    print(
        classification_report(
            truth,
            predicted,
            labels=list(range(len(CLASSES))),
            target_names=list(CLASSES),
            zero_division=0,
        )
    )
    print("Confusion matrix (rows=true, columns=predicted):\n", matrix)

    return report


if __name__ == "__main__":
    path = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else BEST_MODEL
    evaluate(path)
