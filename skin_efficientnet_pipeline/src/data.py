from __future__ import annotations
import numpy as np
import tensorflow as tf
from common import BATCH_SIZE, CLASSES, DATA_DIR, IMAGE_SIZE


def load_splits(
    batch_size: int = BATCH_SIZE,
    seed: int = 42,
    splits: tuple[str, ...] = ("train", "valid"),
):
    datasets = {}

    for split in splits:
        ds = tf.keras.utils.image_dataset_from_directory(
            DATA_DIR / split,
            labels="inferred",
            label_mode="categorical",
            class_names=list(CLASSES),
            batch_size=batch_size,
            image_size=IMAGE_SIZE,
            shuffle=(split == "train"),
            seed=seed if split == "train" else None,
            color_mode="rgb",
        )
        ds = ds.map(
            lambda images, labels: (images, labels),
            num_parallel_calls=tf.data.AUTOTUNE,
            deterministic=(split != "train"),
        )
        datasets[split] = ds.prefetch(tf.data.AUTOTUNE)

    return datasets


def balanced_class_weights(counts: dict[str, int]) -> dict[int, float]:
    values = np.array([counts[name] for name in CLASSES], dtype=np.int64)

    if np.any(values <= 0):
        raise ValueError("Every class must have at least one train image")

    total = int(values.sum())

    return {
        i: float(total / (len(CLASSES) * n))
        for i, n in enumerate(values)
    }
