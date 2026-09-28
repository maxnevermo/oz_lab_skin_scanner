import { Image } from "expo-image";
import { View } from "react-native";
import { usePhotoZoom } from "../hooks/usePhotoZoom";
import { styles } from "../styles/scanner.style";
import { ZoomablePhotoProps } from "../types/scanner.type";

export function ZoomablePhoto(props: ZoomablePhotoProps)
{
    const {
        photo,
        onSwipePrevious,
        onSwipeNext
    } = props;
    const zoom = usePhotoZoom({ onSwipePrevious, onSwipeNext });

    return (
        <View style={styles.zoomContainer}>
            <View
                style={styles.zoomViewport}
                onLayout={({ nativeEvent }) => zoom.setViewport(nativeEvent.layout)}
                {...zoom.panHandlers}
            >
                <View
                    pointerEvents="none"
                    style={[
                        styles.zoomImage,
                        {
                            transform: [
                                { translateX: zoom.transform.offsetX + zoom.swipeOffset },
                                { translateY: zoom.transform.offsetY },
                                { scale: zoom.transform.scale }
                            ]
                        }
                    ]}
                >
                    <Image
                        source={photo.source}
                        style={styles.zoomImage}
                        contentFit="contain"
                        onLoad={(event) => zoom.setImageSize(event.source)}
                    />
                </View>
            </View>
        </View>
    );
}
