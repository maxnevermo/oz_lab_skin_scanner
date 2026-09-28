import {
    MenuAction,
    MenuView,
    NativeActionEvent
} from "@expo/ui/community/menu";
import { View } from "react-native";
import {
    PHOTO_SOURCE_OPTIONS
} from "../constants/scanner.constant";
import {
    PhotoSource,
    PhotoSourceMenuProps
} from "../types/scanner.type";

function createPhotoSourceActions(disabled: boolean): MenuAction[]
{
    const actions: MenuAction[] = [];

    for (const option of PHOTO_SOURCE_OPTIONS)
    {
        actions.push({
            ...option,
            attributes: { disabled }
        });
    }

    return actions;
}

function getPhotoSource(actionId: string): PhotoSource | null
{
    for (const option of PHOTO_SOURCE_OPTIONS)
    {
        if (option.id === actionId)
        {
            return option.id;
        }
    }

    return null;
}

export function PhotoSourceMenu(props: PhotoSourceMenuProps)
{
    const { children, disabled, onSelect } = props;
    const actions = createPhotoSourceActions(disabled);

    function handlePressAction(event: NativeActionEvent)
    {
        if (disabled)
        {
            return;
        }

        const photoSource = getPhotoSource(event.nativeEvent.event);

        if (!photoSource)
        {
            return;
        }

        onSelect(photoSource);
    }

    return (
        <View pointerEvents={disabled ? "none" : "auto"}>
            <MenuView
                actions={actions}
                onPressAction={handlePressAction}
            >
                {children}
            </MenuView>
        </View>
    );
}
