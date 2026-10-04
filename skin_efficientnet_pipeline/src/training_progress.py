from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import tensorflow as tf


class TrainingProgress(tf.keras.callbacks.Callback):
    def __init__(self, total_images: int, batch_size: int, log_path: Path):
        super().__init__()
        self.total_images = total_images
        self.batch_size = batch_size
        self.log_path = log_path
        self.training_started = 0.0
        self.epoch_started = 0.0

    def _write_event(self, event: str, **details) -> None:
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event": event,
            **details,
        }

        with self.log_path.open("a", encoding="utf-8") as stream:
            stream.write(json.dumps(record, ensure_ascii=False) + "\n")

    def on_train_begin(self, logs=None):
        self.training_started = time.perf_counter()
        self._write_event(
            "training_started",
            epochs=int(self.params.get("epochs", 0)),
            images=self.total_images,
            batch_size=self.batch_size,
        )

    def on_epoch_begin(self, epoch, logs=None):
        self.epoch_started = time.perf_counter()
        self._write_event("epoch_started", epoch=epoch + 1)

    def on_train_batch_end(self, batch, logs=None):
        processed = min((batch + 1) * self.batch_size, self.total_images)
        percentage = processed / self.total_images * 100

        loss = (logs or {}).get("loss")
        loss_text = f" loss={loss:.4f}" if loss is not None else ""

        print(
            f"\rProcessed {processed}/{self.total_images} images "
            f"({percentage:5.1f}%){loss_text}",
            end="",
            flush=True,
        )

    def on_epoch_end(self, epoch, logs=None):
        duration = time.perf_counter() - self.epoch_started

        metrics = {
            key: float(value)
            for key, value in (logs or {}).items()
            if isinstance(value, (int, float, np.number))
        }

        print(f"\nEpoch {epoch + 1} completed in {duration:.2f}s")

        self._write_event(
            "epoch_completed",
            epoch=epoch + 1,
            duration_seconds=duration,
            metrics=metrics,
        )

    def on_train_end(self, logs=None):
        self._write_event(
            "training_completed",
            duration_seconds=(
                time.perf_counter() - self.training_started
            ),
        )