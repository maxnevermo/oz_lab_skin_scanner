import {
    Linking,
    Modal,
    Pressable,
    Text,
    View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
    SafeAreaProvider,
    SafeAreaView
} from "react-native-safe-area-context";
import {
    SCANNER_TEXT
} from "../constants/scanner.constant";
import { ZoomablePhoto } from "./ZoomablePhoto";
import { styles } from "../styles/scanner.style";
import { PhotoViewerProps } from "../types/scanner.type";

export function PhotoViewer(props: PhotoViewerProps)
{
    const { photos, selectedIndex, onSelect, onClose } = props;
    const photo = photos[selectedIndex];
    const previousIndex = selectedIndex - 1;
    const nextIndex = selectedIndex + 1;
    const hasPreviousPhoto = previousIndex >= 0;
    const hasNextPhoto = nextIndex < photos.length;

    if (!photo)
    {
        return null;
    }

    const onSwipePrevious = hasPreviousPhoto && onSelect
        ? () => onSelect(previousIndex)
        : undefined;
    const onSwipeNext = hasNextPhoto && onSelect
        ? () => onSelect(nextIndex)
        : undefined;
    let counterContent = null;
    let creditContent = null;

    if (photos.length > 1 && onSelect)
    {
        counterContent = (
            <Text style={styles.viewerCaption}>
                {selectedIndex + 1} / {photos.length}
            </Text>
        );
    }

    if ("credit" in photo)
    {
        creditContent = (
            <>
                <Text style={styles.viewerCaption}>
                    {photo.credit} · {SCANNER_TEXT.resized}
                </Text>
                <View style={styles.row}>
                    <Pressable
                        accessibilityRole="link"
                        onPress={() => Linking.openURL(photo.url)}
                        style={styles.textButton}
                    >
                        <Text
                            style={styles.viewerLink}>{SCANNER_TEXT.source}</Text>
                    </Pressable>
                    <Pressable
                        accessibilityRole="link"
                        onPress={() => Linking.openURL(photo.licenseUrl)}
                        style={styles.textButton}
                    >
                        <Text
                            style={styles.viewerLink}>{photo.license}</Text>
                    </Pressable>
                </View>
            </>
        );
    }

    return (
        <Modal
            visible
            presentationStyle="fullScreen"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onClose}
        >
            <SafeAreaProvider style={styles.viewer}>
                <StatusBar style="light"/>
                <SafeAreaView style={styles.viewer}>
                    <View style={styles.viewerHeader}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={onClose}
                            style={styles.textButton}
                        >
                            <Text
                                style={styles.viewerAction}>{SCANNER_TEXT.close}</Text>
                        </Pressable>
                    </View>
                    <ZoomablePhoto
                        key={selectedIndex}
                        photo={photo}
                        onSwipePrevious={onSwipePrevious}
                        onSwipeNext={onSwipeNext}
                    />
                    <View style={styles.viewerFooter}>
                        {counterContent}
                        {creditContent}
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}
