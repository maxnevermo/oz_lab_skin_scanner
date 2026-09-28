import { useState } from "react";
import { Image } from "expo-image";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions
} from "react-native";
import { CameraIcon } from "./CameraIcon";
import { PhotoExportMenu } from "./PhotoExportMenu";
import { PhotoInfoButton } from "./PhotoInfoButton";
import { PhotoSourceMenu } from "./PhotoSourceMenu";
import { PhotoViewer } from "./PhotoViewer";
import {
    SCANNER_LAYOUT,
    SCANNER_SPACING,
    SCANNER_TEXT
} from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import { PhotoInputProps } from "../types/scanner.type";

export function PhotoInput(props: PhotoInputProps)
{
    const {
        photo,
        isPickingPhoto,
        isSavingPhoto,
        onSelect,
        onSave,
        onRemove,
        onLoad,
        onError
    } = props;
    const { width } = useWindowDimensions();
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const photoWidth =
        Math.min(width, SCANNER_LAYOUT.contentWidth) - SCANNER_SPACING.large * 2;
    const photoHeading = photo ? photo.name : SCANNER_TEXT.emptyPhoto;
    let photoStatusContent = null;
    let photoAreaContent;
    let selectedPhotoActions = null;
    let photoViewerContent = null;

    function removePhoto()
    {
        setIsViewerOpen(false);
        onRemove();
    }

    if (photo)
    {
        photoStatusContent = (
            <View style={styles.photoStatus}>
                <Text
                    style={styles.caption}>{SCANNER_TEXT.selectedPhoto}</Text>
                <PhotoInfoButton photo={photo}/>
            </View>
        );
        photoAreaContent = (
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={SCANNER_TEXT.openPhoto}
                onPress={() => setIsViewerOpen(true)}
                style={[styles.photoArea, { width: photoWidth }]}
            >
                <Image
                    key={photo.uri}
                    source={{ uri: photo.uri }}
                    style={StyleSheet.absoluteFill}
                    contentFit="contain"
                    accessibilityLabel={SCANNER_TEXT.selectedPhoto}
                    onLoad={onLoad}
                    onError={onError}
                />
            </Pressable>
        );
        selectedPhotoActions = (
            <View style={styles.row}>
                <PhotoExportMenu
                    disabled={isPickingPhoto || isSavingPhoto}
                    onSave={onSave}
                />
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={SCANNER_TEXT.removePhoto}
                    disabled={isPickingPhoto || isSavingPhoto}
                    onPress={removePhoto}
                    style={[styles.textButton, styles.photoActionButton]}
                >
                    <Text style={styles.actionText}>
                        {SCANNER_TEXT.removePhoto}
                    </Text>
                </Pressable>
            </View>
        );

        if (isViewerOpen)
        {
            photoViewerContent = (
                <PhotoViewer
                    photos={[{
                        source: { uri: photo.uri },
                        detail: photo.name
                    }]}
                    selectedIndex={0}
                    onClose={() => setIsViewerOpen(false)}
                />
            );
        }
    }
    else
    {
        const placeholderText = isPickingPhoto ? SCANNER_TEXT.openingPhoto : SCANNER_TEXT.instruction;

        photoAreaContent = (
            <PhotoSourceMenu
                disabled={isPickingPhoto}
                onSelect={onSelect}>
                <View
                    style={[styles.photoArea, { width: photoWidth }]}
                    accessibilityLabel={SCANNER_TEXT.photoPlaceholder}>
                    <View style={styles.placeholderContent}>
                        <CameraIcon/>
                        <Text style={styles.photoPlaceholder}>
                            {placeholderText}
                        </Text>
                        <Text style={styles.caption}>
                            {SCANNER_TEXT.photoSources}
                        </Text>
                    </View>
                </View>
            </PhotoSourceMenu>
        );
    }

    return (
        <View style={styles.photoSection}>
            <View style={styles.row}>
                <Text numberOfLines={1}
                      style={styles.photoHeading}>
                    {photoHeading}
                </Text>
                {photoStatusContent}
            </View>
            {photoAreaContent}
            <View style={styles.photoFooter}>
                <Text style={styles.caption}>
                    {photo ? SCANNER_TEXT.viewPhoto : SCANNER_TEXT.photoHint}
                </Text>
                {selectedPhotoActions}
            </View>
            {photoViewerContent}
        </View>
    );
}
