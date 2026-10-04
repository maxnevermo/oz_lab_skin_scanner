from __future__ import annotations
import tensorflow as tf
from tensorflow.keras import Model, layers
from common import CLASSES, IMAGE_SIZE

def make_augmentation():
    return tf.keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.2),
            layers.RandomZoom(height_factor=0.1),
            layers.RandomBrightness(0.1),
            layers.RandomContrast(0.2),
            layers.GaussianNoise(0.02),
            layers.Resizing(height=IMAGE_SIZE[0], width=IMAGE_SIZE[1]),
        ],
        name="data_augmentation",
    )

def build_model(learning_rate: float = 0.0001) -> Model:
    backbone = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(*IMAGE_SIZE, 3),
    )
    backbone.trainable = True

    image = layers.Input(shape=(*IMAGE_SIZE, 3), name="image")

    x = make_augmentation()(image)
    x = backbone(x, training=False)
    x = layers.GlobalAveragePooling2D(name="avg_pool")(x)
    x = layers.Dense(1024, activation="relu", name="fc_1024")(x)
    x = layers.BatchNormalization(name="bn_1024")(x)
    x = layers.Dropout(0.6, name="dropout_06")(x)
    x = layers.Dense(
        512,
        activation="relu",
        kernel_regularizer=tf.keras.regularizers.l2(0.005),
        name="fc_512",
    )(x)
    x = layers.BatchNormalization(name="bn_512")(x)
    x = layers.Dropout(0.5, name="dropout_05")(x)

    output = layers.Dense(
        len(CLASSES),
        activation="softmax",
        kernel_regularizer=tf.keras.regularizers.l2(0.005),
        name="predictions",
    )(x)

    model = Model(inputs=image, outputs=output, name="acne_efficientnet_b0")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=learning_rate,
            beta_1=0.9,
            beta_2=0.999,
            epsilon=1e-7,
            amsgrad=True,
        ),
        loss="categorical_crossentropy",
        metrics=[
            "accuracy",
            tf.keras.metrics.Precision(name="precision"),
            tf.keras.metrics.Recall(name="recall"),
        ],
    )

    return model


def build_inference_model(trained: Model) -> Model:
    input_layer = layers.Input(shape=(*IMAGE_SIZE, 3), name="image")
    backbone = trained.get_layer("efficientnetb0")
    x = backbone(input_layer, training=False)

    for name in (
        "avg_pool",
        "fc_1024",
        "bn_1024",
        "dropout_06",
        "fc_512",
        "bn_512",
        "dropout_05",
        "predictions",
    ):
        x = trained.get_layer(name)(x, training=False)

    return Model(input_layer, x, name="acne_efficientnet_b0_inference")
