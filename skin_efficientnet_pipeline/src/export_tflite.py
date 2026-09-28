from __future__ import annotations
import sys
from pathlib import Path
import numpy as np
import tensorflow as tf
from common import BEST_MODEL, CLASSES, IMAGE_SIZE
from model import build_inference_model

def export(model_path: Path = BEST_MODEL, output_path: Path | None = None) -> Path:
    model_path = Path(model_path)

    if not model_path.is_file():
        raise FileNotFoundError(f"Model not found: {model_path}. Run train.py first.")

    if output_path is None:
        output_path = model_path.with_suffix(".tflite")
    else:
        output_path = Path(output_path)

    print(f"Loading Keras model: {model_path}")
    print(f"TFLite output: {output_path}")

    trained = tf.keras.models.load_model(model_path, compile=False)
    inference = build_inference_model(trained)

    rng = np.random.default_rng(42)
    sample = rng.uniform(0, 255, size=(1, *IMAGE_SIZE, 3)).astype(np.float32)

    expected = trained(sample, training=False).numpy()
    actual = inference(sample, training=False).numpy()

    np.testing.assert_allclose(expected, actual, rtol=1e-4, atol=1e-4)

    converter = tf.lite.TFLiteConverter.from_keras_model(inference)
    converted = converter.convert()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(converted)

    interpreter = tf.lite.Interpreter(model_path=str(output_path), num_threads=2)
    interpreter.allocate_tensors()

    inp = interpreter.get_input_details()[0]
    out = interpreter.get_output_details()[0]

    input_shape = tuple(int(value) for value in inp["shape"])
    output_shape = tuple(int(value) for value in out["shape"])

    if input_shape != (1, *IMAGE_SIZE, 3) or inp["dtype"] != np.float32:
        raise RuntimeError(f"Incompatible TFLite input: {input_shape} / {inp['dtype']}")

    if output_shape != (1, len(CLASSES)) or out["dtype"] != np.float32:
        raise RuntimeError(f"Incompatible TFLite output: {output_shape} / {out['dtype']}")

    interpreter.set_tensor(inp["index"], sample)
    interpreter.invoke()

    result = interpreter.get_tensor(out["index"])
    max_error = float(np.max(np.abs(actual - result)))

    print()
    print(f"Exported {output_path}")
    print(f"Keras vs TFLite max abs difference: {max_error:.8f}")

    if int(np.argmax(actual)) != int(np.argmax(result)):
        print("WARNING: Keras and TFLite top class differ on the export smoke-test input.")

    if max_error > 1e-3:
        print(
            "WARNING: Large inference difference. "
            "Compare more real photos before backend replacement."
        )

    print("Backend-compatible tensor shapes and dtype: OK")

    return output_path


if __name__ == "__main__":
    model_path = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else BEST_MODEL
    output_path = Path(sys.argv[2]).expanduser().resolve() if len(sys.argv) > 2 else None
    export(model_path, output_path)
