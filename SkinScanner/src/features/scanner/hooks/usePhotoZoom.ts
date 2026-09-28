import { useRef, useState } from "react";
import {
    PanResponder,
    PanResponderGestureState,
    GestureResponderEvent
} from "react-native";
import {
    PHOTO_SWIPE,
    PHOTO_ZOOM
} from "../constants/scanner.constant";
import {
    PhotoNavigation,
    PhotoSize,
    PhotoTransform
} from "../types/scanner.type";

const initialTransform: PhotoTransform = {
    scale: PHOTO_ZOOM.minimum,
    offsetX: 0,
    offsetY: 0
};

export function usePhotoZoom(props: PhotoNavigation)
{
    const { onSwipePrevious, onSwipeNext } = props;
    const [swipeOffset, setSwipeOffset] = useState(0);
    const isSwipeGesture = useRef(false);
    const [transform, setTransform] = useState(initialTransform);
    const transformRef = useRef(initialTransform);
    const viewport = useRef<PhotoSize>({ width: 0, height: 0 });
    const imageSize = useRef<PhotoSize>({ width: 0, height: 0 });
    const gestureStart = useRef({
        touchCount: 0,
        distance: 0,
        x: 0,
        y: 0,
        ...initialTransform
    });

    function updateTransform(next: PhotoTransform)
    {
        const scale = Math.max(
            PHOTO_ZOOM.minimum,
            Math.min(PHOTO_ZOOM.maximum, next.scale)
        );
        const { width, height } = viewport.current;
        const image = imageSize.current;
        const fitScale =
            image.width && image.height
                ? Math.min(width / image.width, height / image.height)
                : 1;
        const horizontalLimit = Math.max(
            0,
            ((image.width || width) * fitScale * scale - width) / 2
        );
        const verticalLimit = Math.max(
            0,
            ((image.height || height) * fitScale * scale - height) / 2
        );
        const nextTransform = {
            scale,
            offsetX: Math.max(
                -horizontalLimit,
                Math.min(horizontalLimit, next.offsetX)
            ),
            offsetY: Math.max(-verticalLimit, Math.min(verticalLimit, next.offsetY))
        };

        transformRef.current = nextTransform;
        setTransform(nextTransform);
    }

    function handleGesture(event: GestureResponderEvent)
    {
        const touches = event.nativeEvent.touches;
        const [firstTouch, secondTouch] = touches;

        if (!firstTouch)
        {
            return;
        }

        if (touches.length > 1)
        {
            isSwipeGesture.current = false;
            setSwipeOffset(0);
        }

        const distance = secondTouch
            ? Math.hypot(
                secondTouch.pageX - firstTouch.pageX,
                secondTouch.pageY - firstTouch.pageY
            )
            : 0;
        const start = gestureStart.current;

        if (start.touchCount !== touches.length)
        {
            gestureStart.current = {
                ...transformRef.current,
                touchCount: touches.length,
                distance,
                x: firstTouch.pageX,
                y: firstTouch.pageY
            };

            return;
        }

        if (touches.length === PHOTO_ZOOM.pinchTouchCount && start.distance > 0)
        {
            updateTransform({
                ...start,
                scale: (start.scale * distance) / start.distance
            });

            return;
        }

        if (isSwipeGesture.current)
        {
            const horizontalOffset = firstTouch.pageX - start.x;
            const verticalOffset = firstTouch.pageY - start.y;
            const hasPhotoInDirection =
                horizontalOffset < 0 ? onSwipeNext : onSwipePrevious;
            const isHorizontal =
                Math.abs(horizontalOffset) >
                Math.abs(verticalOffset) * PHOTO_SWIPE.horizontalDominance;

            setSwipeOffset(hasPhotoInDirection && isHorizontal ? horizontalOffset : 0);

            return;
        }

        updateTransform({
            ...start,
            offsetX: start.offsetX + firstTouch.pageX - start.x,
            offsetY: start.offsetY + firstTouch.pageY - start.y
        });
    }

    function finishGesture(gesture: PanResponderGestureState)
    {
        const shouldNavigate =
            isSwipeGesture.current &&
            Math.abs(gesture.dx) >= PHOTO_SWIPE.minimumDistance &&
            Math.abs(gesture.dx) >
            Math.abs(gesture.dy) * PHOTO_SWIPE.horizontalDominance;

        gestureStart.current.touchCount = 0;
        isSwipeGesture.current = false;
        setSwipeOffset(0);

        if (!shouldNavigate)
        {
            return;
        }

        if (gesture.dx < 0)
        {
            onSwipeNext?.();
        }
        else
        {
            onSwipePrevious?.();
        }
    }

    const [responder] = useState(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) =>
            {
                isSwipeGesture.current =
                    transformRef.current.scale === PHOTO_ZOOM.minimum &&
                    event.nativeEvent.touches.length === 1;
                handleGesture(event);
            },
            onPanResponderStart: handleGesture,
            onPanResponderMove: handleGesture,
            onPanResponderEnd: handleGesture,
            onPanResponderRelease: (_event, gesture) => finishGesture(gesture),
            onPanResponderTerminate: () =>
            {
                isSwipeGesture.current = false;
                setSwipeOffset(0);
                gestureStart.current.touchCount = 0;
            }
        })
    );

    return {
        transform,
        swipeOffset,
        panHandlers: responder.panHandlers,
        setViewport: (size: PhotoSize) =>
        {
            viewport.current = size;
            updateTransform(initialTransform);
        },
        setImageSize: (size: PhotoSize) =>
        {
            imageSize.current = size;
            updateTransform(transformRef.current);
        }
    };
}
