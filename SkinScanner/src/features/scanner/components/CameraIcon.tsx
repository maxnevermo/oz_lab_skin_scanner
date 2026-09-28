import { Image } from "expo-image";
import {
    SCANNER_COLORS,
    SCANNER_LAYOUT
} from "../constants/scanner.constant";

const cameraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="${SCANNER_COLORS.action}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 8l2-3h6l2 3h5a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/><circle cx="16" cy="17" r="6"/></svg>`;
const cameraSource = {
    uri: `data:image/svg+xml;utf8,${encodeURIComponent(cameraSvg)}`
};
const iconStyle = {
    width: SCANNER_LAYOUT.iconSize,
    height: SCANNER_LAYOUT.iconSize
};

export function CameraIcon()
{
    return (
        <Image
            source={cameraSource}
            style={iconStyle}
            accessibilityElementsHidden
        />
    );
}
