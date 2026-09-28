from pathlib import Path
from threading import local
import numpy as np
import tensorflow as tf
from PIL import Image


class SkinAnalyzer:
    CLASSES = ["Blackheads", "Cyst", "Papules", "Pustules", "Whiteheads"]

    def __init__(self, model_path: Path):
        if not model_path.is_file():
            raise FileNotFoundError(f"Model not found: {model_path}")

        self.classes = self.CLASSES
        self.model_path = model_path

        self._worker_state = local()

    def _get_runtime(self):
        runtime = getattr(self._worker_state, "runtime", None)

        if runtime is None:
            interpreter = tf.lite.Interpreter(model_path=str(self.model_path), num_threads=4)
            interpreter.allocate_tensors()

            input_details = interpreter.get_input_details()[0]
            output_details = interpreter.get_output_details()[0]

            input_shape = tuple(input_details["shape"].tolist())

            if input_shape != (1, 150, 150, 3):
                raise ValueError(f"Unexpected model input shape: {input_shape}")

            if input_details["dtype"] != np.float32:
                raise ValueError("Expected a float32 TFLite model.")

            output_shape = tuple(output_details["shape"].tolist())

            if output_shape != (1, len(self.classes)):
                raise ValueError(f"Unexpected model output shape: {output_shape}")

            runtime = (interpreter, input_details["index"], output_details["index"])

            self._worker_state.runtime = runtime

        return runtime

    def analyze(self, image: Image.Image) -> dict:
        image = image.convert("RGB")

        image_array = np.asarray(image, dtype=np.float32)
        image_array = tf.image.resize(image_array,(150, 150),method="bilinear").numpy()
        image_array = np.expand_dims(image_array,axis=0)

        interpreter, input_index, output_index = self._get_runtime()

        interpreter.set_tensor(input_index,image_array)
        interpreter.invoke()

        probabilities = interpreter.get_tensor(output_index)[0].astype(np.float64)

        raw_scores = {
            name: float(score)
            for name, score in zip(self.classes, probabilities)
        }

        scores = {
            "Blackheads": raw_scores["Blackheads"],
            "Cyst": raw_scores["Cyst"],
            "Inflammatory": (raw_scores["Papules"]+ raw_scores["Pustules"]),
            "Whiteheads": raw_scores["Whiteheads"],
        }

        predicted_class = max(scores, key=scores.get)

        return {
            "predicted_class": predicted_class,
            "scores": scores,
        }