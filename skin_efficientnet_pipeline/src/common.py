from __future__ import annotations
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "dataset"
RUN_DIR = ROOT / "runs" / "efficientnet_b0"
BEST_MODEL = RUN_DIR / "best_model.keras"

CLASSES = ("Blackheads", "Cyst", "Papules", "Pustules", "Whiteheads")
IMAGE_SIZE = (150, 150)
BATCH_SIZE = 32
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".bmp", ".gif"}


def inspect_dataset(dataset_dir: Path = DATA_DIR, splits: tuple[str, ...] = ("train", "valid")) -> dict[str, dict[str, int]]:
    result: dict[str, dict[str, int]] = {}
    expected_classes = set(CLASSES)

    for split in splits:
        directory = dataset_dir / split

        if not directory.is_dir():
            raise ValueError(f"Missing dataset split: {directory}")

        actual_classes = {
            p.name
            for p in directory.iterdir()
            if p.is_dir() and not p.name.startswith(".")
        }

        if actual_classes != expected_classes:
            missing = sorted(expected_classes - actual_classes)
            extra = sorted(actual_classes - expected_classes)

            raise ValueError(f"{directory}: class folders mismatch; missing={missing}, extra={extra}")

        counts = {}

        for class_name in CLASSES:
            image_count = sum(
                1
                for p in (directory / class_name).rglob("*")
                if p.is_file() and p.suffix.lower() in IMAGE_SUFFIXES
            )

            if not image_count:
                raise ValueError(f"No supported images in {directory / class_name}; use jpg/jpeg/png/bmp/gif")

            counts[class_name] = image_count
        result[split] = counts

    return result