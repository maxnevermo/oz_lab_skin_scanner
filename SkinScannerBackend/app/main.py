import os
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps, UnidentifiedImageError
from .analyzer import SkinAnalyzer


BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(BACKEND_DIR / "models" / "efficientnet-model.tflite"))).expanduser()

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 9_000_000


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.analyzer = SkinAnalyzer(MODEL_PATH)
    yield

app = FastAPI(
    title="SkinScanner API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

def _decode_and_analyze(content: bytes, analyzer: SkinAnalyzer) -> dict:
    try:
        with Image.open(BytesIO(content)) as source:
            if source.width * source.height > MAX_IMAGE_PIXELS:
                raise HTTPException(status_code=413, detail="Image resolution is too large.")

            image = ImageOps.exif_transpose(source)
            image.load()

    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise HTTPException(status_code=415, detail="Unsupported image format.") from exc

    return analyzer.analyze(image)


@app.post("/analyze-face")
async def analyze_face(file: UploadFile = File(...)) -> dict:
    try:
        content = await file.read(MAX_UPLOAD_BYTES + 1)
    finally:
        await file.close()

    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large.",)

    if not content:
        raise HTTPException(status_code=400, detail="Image is empty.")

    return await run_in_threadpool(_decode_and_analyze,content,app.state.analyzer)