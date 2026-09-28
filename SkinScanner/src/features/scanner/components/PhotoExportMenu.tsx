import {
    MenuAction,
    MenuView,
    NativeActionEvent
} from "@expo/ui/community/menu";
import { Pressable, Text, View } from "react-native";
import {
    IMAGE_FORMAT_OPTIONS,
    SCANNER_TEXT
} from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import {
    ImageFormat,
    PhotoExportMenuProps
} from "../types/scanner.type";

function createImageFormatActions(disabled: boolean): MenuAction[]
{
    const actions: MenuAction[] = [];

    for (const option of IMAGE_FORMAT_OPTIONS)
    {
        actions.push({
            ...option,
            attributes: { disabled }
        });
    }

    return actions;
}

function getImageFormat(actionId: string): ImageFormat | null
{
    for (const option of IMAGE_FORMAT_OPTIONS)
    {
        if (option.id === actionId)
        {
            return option.id;
        }
    }

    return null;
}

export function PhotoExportMenu(props: PhotoExportMenuProps)
{
    const { disabled, onSave } = props;
    const actions = createImageFormatActions(disabled);
    const buttonLabel = disabled ? SCANNER_TEXT.savingPhoto : SCANNER_TEXT.savePhoto;

    function handlePressAction(event: NativeActionEvent)
    {
        if (disabled)
        {
            return;
        }

        const imageFormat = getImageFormat(event.nativeEvent.event);

        if (!imageFormat)
        {
            return;
        }

        onSave(imageFormat);
    }

    return (
        <View pointerEvents={disabled ? "none" : "auto"}>
            <MenuView
                actions={actions}
                onPressAction={handlePressAction}
            >
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={SCANNER_TEXT.savePhoto}
                    disabled={disabled}
                    style={[styles.textButton, styles.photoActionButton]}
                >
                    <Text style={styles.actionText}>
                        {buttonLabel}
                    </Text>
                </Pressable>
            </MenuView>
        </View>
    );
}
