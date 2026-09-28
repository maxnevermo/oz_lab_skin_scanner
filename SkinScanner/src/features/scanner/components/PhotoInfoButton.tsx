import { Alert, Pressable, Text } from "react-native";
import { SCANNER_TEXT } from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import { PhotoInfoButtonProps } from "../types/scanner.type";
import { formatPhotoMetadata } from "../utils/formatPhotoMetadata";

export function PhotoInfoButton(props: PhotoInfoButtonProps)
{
    const { photo } = props;

    function showPhotoInformation()
    {
        Alert.alert(
            SCANNER_TEXT.imageInformation,
            formatPhotoMetadata(photo)
        );
    }

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={SCANNER_TEXT.imageInformation}
            hitSlop={8}
            onPress={showPhotoInformation}
            style={styles.infoButton}
        >
            <Text style={styles.infoIcon}>ⓘ</Text>
        </Pressable>
    );
}
