import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import {
    IMAGE_FILE_TYPE,
    IMAGE_MIME_PREFIX,
    PHOTO_SOURCE,
    SCANNER_TEXT
} from "../constants/scanner.constant";
import {
    PhotoSelection,
    PhotoSource
} from "../types/scanner.type";

export async function pickPhoto(source: PhotoSource): Promise<PhotoSelection>
{
    try
    {
        if (source === PHOTO_SOURCE.files)
        {
            const selection = await DocumentPicker.getDocumentAsync({
                type: IMAGE_FILE_TYPE,
                multiple: false,
                copyToCacheDirectory: true
            });

            if (selection.canceled)
            {
                return { photo: null };
            }

            const [asset] = selection.assets;

            if (
                !asset ||
                (asset.mimeType && !asset.mimeType.startsWith(IMAGE_MIME_PREFIX))
            )
            {
                return {
                    photo: null,
                    error: SCANNER_TEXT.invalidImageError
                };
            }

            const dimensions = await Image.getSize(asset.uri);

            return {
                photo: {
                    uri: asset.uri,
                    name: asset.name,
                    mimeType: asset.mimeType,
                    size: asset.size,
                    width: dimensions.width,
                    height: dimensions.height
                }
            };
        }

        if (source === PHOTO_SOURCE.camera)
        {
            const permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted)
            {
                return {
                    photo: null,
                    error: SCANNER_TEXT.cameraPermissionError
                };
            }
        }

        const openPicker =
            source === PHOTO_SOURCE.camera
                ? ImagePicker.launchCameraAsync
                : ImagePicker.launchImageLibraryAsync;
        const selection = await openPicker({
            mediaTypes: ["images"],
            allowsEditing: false
        });

        if (selection.canceled)
        {
            return { photo: null };
        }

        const [asset] = selection.assets;

        if (!asset)
        {
            return {
                photo: null,
                error: SCANNER_TEXT.selectionError
            };
        }

        return {
            photo: {
                uri: asset.uri,
                name: asset.fileName || "capture.jpg",
                mimeType: asset.mimeType,
                size: asset.fileSize,
                width: asset.width,
                height: asset.height
            }
        };
    } catch
    {
        return {
            photo: null,
            error: SCANNER_TEXT.selectionError
        };
    }
}
