from __future__ import annotations
import logging
import threading
import time
import uuid
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import TYPE_CHECKING, Any
from PIL import Image, ImageOps, UnidentifiedImageError

if TYPE_CHECKING:
    from .analyzer import SkinAnalyzer

MAX_IMAGE_PIXELS = 9_000_000
STAGE_PROGRESS = {
    "queued": 25,
    "decoding": 35,
    "preprocessing": 55,
    "inference": 80,
    "completed": 100,
}


class AnalysisInputError(Exception):
    pass


class AnalysisResolutionError(AnalysisInputError):
    pass


def decode_image(content: bytes) -> Image.Image:
    try:
        with Image.open(BytesIO(content)) as source:
            if source.width * source.height > MAX_IMAGE_PIXELS:
                raise AnalysisResolutionError("Image resolution is too large.")

            image = ImageOps.exif_transpose(source).convert("RGB")
            image.load()

            return image
    except AnalysisInputError:
        raise
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise AnalysisInputError("Unsupported image format.") from exc


class AnalysisJobManager:
    def __init__(self, analyzer: SkinAnalyzer, logger: logging.Logger):
        self.analyzer = analyzer
        self.logger = logger
        self._lock = threading.Lock()
        self._jobs: dict[str, dict[str, Any]] = {}

    def create(self, filename: str) -> dict:
        safe_filename = Path(filename).name.replace("\n", " ").replace("\r", " ")
        job_id = uuid.uuid4().hex
        now = datetime.now(timezone.utc).isoformat()
        job = {
            "job_id": job_id,
            "filename": safe_filename,
            "status": "queued",
            "stage": "queued",
            "progress": STAGE_PROGRESS["queued"],
            "events": [{
                "stage": "queued",
                "message": "Analysis queued",
                "timestamp": now,
            }],
            "result": None,
            "error": None,
            "stage_started": time.perf_counter(),
            "stage_durations_ms": {},
        }

        with self._lock:
            self._jobs[job_id] = job

        self.logger.info("job=%s file=%r status=queued", job_id, safe_filename)
        return self.get(job_id)

    def get(self, job_id: str) -> dict:
        with self._lock:
            job = self._jobs.get(job_id)

            if job is None:
                raise KeyError(job_id)

            return self._snapshot(job)

    def run(self, job_id: str, content: bytes) -> None:
        started = time.perf_counter()

        try:
            self._transition(job_id, "decoding", "Decoding image")
            image = decode_image(content)

            self._transition(job_id, "preprocessing", "Preparing model input")
            image_array = self.analyzer.preprocess(image)

            self._transition(job_id, "inference", "Running TFLite inference")
            result = self.analyzer.infer(image_array)

            self._finish(job_id, result, started)
        except Exception as exc:
            self._fail(job_id, exc, started)

    @staticmethod
    def _snapshot(job: dict[str, Any]) -> dict:
        result = dict(job["result"]) if isinstance(job["result"], dict) else job["result"]

        return {
            "job_id": job["job_id"],
            "status": job["status"],
            "stage": job["stage"],
            "progress": job["progress"],
            "events": [dict(event) for event in job["events"]],
            "result": result,
            "error": job["error"],
        }

    def _transition(self, job_id: str, stage: str, message: str) -> None:
        now_counter = time.perf_counter()
        now = datetime.now(timezone.utc).isoformat()

        with self._lock:
            job = self._jobs[job_id]
            previous_stage = job["stage"]
            duration_ms = (now_counter - job["stage_started"]) * 1000
            job["stage_durations_ms"][previous_stage] = duration_ms
            job["events"][-1]["duration_ms"] = duration_ms
            job["status"] = stage
            job["stage"] = stage
            job["progress"] = STAGE_PROGRESS[stage]
            job["stage_started"] = now_counter
            job["events"].append({
                "stage": stage,
                "message": message,
                "timestamp": now,
            })

        self.logger.info(
            "job=%s status=%s previous_stage_ms=%.2f",
            job_id,
            stage,
            duration_ms,
        )

    def _finish(self, job_id: str, result: dict, started: float) -> None:
        self._transition(job_id, "completed", "Analysis completed")
        server_duration_ms = (time.perf_counter() - started) * 1000

        with self._lock:
            job = self._jobs[job_id]
            result["server_duration_ms"] = server_duration_ms
            result["stage_durations_ms"] = dict(job["stage_durations_ms"])
            job["result"] = result

        self.logger.info("job=%s completed duration_ms=%.2f", job_id, server_duration_ms)

    def _fail(self, job_id: str, error: Exception, started: float) -> None:
        message = str(error) if isinstance(error, AnalysisInputError) else "Analysis failed."
        duration_ms = (time.perf_counter() - started) * 1000
        now = datetime.now(timezone.utc).isoformat()

        with self._lock:
            job = self._jobs[job_id]
            previous_stage = job["stage"]
            stage_duration = (time.perf_counter() - job["stage_started"]) * 1000
            job["stage_durations_ms"][previous_stage] = stage_duration
            job["events"][-1]["duration_ms"] = stage_duration
            job["status"] = "failed"
            job["stage"] = "failed"
            job["error"] = message
            job["events"].append({
                "stage": "failed",
                "message": message,
                "timestamp": now,
            })

        if isinstance(error, AnalysisInputError):
            self.logger.warning(
                "job=%s failed duration_ms=%.2f error=%s",
                job_id,
                duration_ms,
                error,
            )
        else:
            self.logger.exception(
                "job=%s failed duration_ms=%.2f error=%s",
                job_id,
                duration_ms,
                error,
            )