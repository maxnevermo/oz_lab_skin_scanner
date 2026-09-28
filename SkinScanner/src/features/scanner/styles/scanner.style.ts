import { StyleSheet } from "react-native";
import {
    SCANNER_COLORS,
    SCANNER_LAYOUT,
    SCANNER_SPACING
} from "../constants/scanner.constant";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: SCANNER_COLORS.background
    },
    content: {
        width: "100%",
        maxWidth: SCANNER_LAYOUT.contentWidth,
        alignSelf: "center",
        padding: SCANNER_SPACING.large,
        gap: SCANNER_SPACING.large
    },
    header: {
        gap: SCANNER_SPACING.small,
        paddingBottom: SCANNER_SPACING.large,
        borderBottomWidth: SCANNER_LAYOUT.borderWidth,
        borderBottomColor: SCANNER_COLORS.border
    },
    placeholderContent: {
        alignItems: "center",
        gap: SCANNER_SPACING.medium,
        maxWidth: SCANNER_LAYOUT.placeholderWidth
    },
    photoSection: { gap: SCANNER_SPACING.medium },
    photoFooter: { gap: SCANNER_SPACING.extraSmall },
    analysisControls: { gap: SCANNER_SPACING.small },
    photoHeading: {
        flex: 1,
        fontSize: SCANNER_LAYOUT.headingFontSize,
        fontWeight: "600",
        color: SCANNER_COLORS.text
    },
    photoStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: SCANNER_SPACING.extraSmall
    },
    title: {
        fontSize: SCANNER_LAYOUT.titleFontSize,
        fontWeight: "600",
        color: SCANNER_COLORS.text
    },
    heading: {
        fontSize: SCANNER_LAYOUT.headingFontSize,
        fontWeight: "600",
        color: SCANNER_COLORS.text
    },
    caption: {
        fontSize: SCANNER_LAYOUT.captionFontSize,
        lineHeight: SCANNER_LAYOUT.captionLineHeight,
        color: SCANNER_COLORS.secondaryText
    },
    section: { gap: SCANNER_SPACING.small },
    photoArea: {
        aspectRatio: SCANNER_LAYOUT.photoAspectRatio,
        borderWidth: SCANNER_LAYOUT.borderWidth,
        borderColor: SCANNER_COLORS.border,
        borderRadius: SCANNER_LAYOUT.borderRadius,
        backgroundColor: SCANNER_COLORS.surface,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    photoPlaceholder: {
        textAlign: "center",
        fontSize: SCANNER_LAYOUT.bodyFontSize,
        color: SCANNER_COLORS.text,
        fontWeight: "500",
        lineHeight: SCANNER_LAYOUT.bodyLineHeight
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SCANNER_SPACING.small
    },
    textButton: {
        minHeight: SCANNER_LAYOUT.buttonHeight,
        justifyContent: "center",
        paddingHorizontal: SCANNER_SPACING.small
    },
    photoActionButton: { paddingHorizontal: 0 },
    actionText: {
        fontSize: SCANNER_LAYOUT.captionFontSize,
        color: SCANNER_COLORS.action
    },
    infoButton: {
        width: SCANNER_LAYOUT.iconSize,
        height: SCANNER_LAYOUT.iconSize,
        alignItems: "center",
        justifyContent: "center"
    },
    infoIcon: {
        color: SCANNER_COLORS.action,
        fontSize: SCANNER_LAYOUT.headingFontSize
    },
    progressSection: { gap: SCANNER_SPACING.small },
    progressTrack: {
        height: SCANNER_SPACING.small,
        borderRadius: SCANNER_SPACING.small / 2,
        backgroundColor: SCANNER_COLORS.disabled,
        overflow: "hidden"
    },
    progressFill: {
        height: "100%",
        borderRadius: SCANNER_SPACING.small / 2,
        backgroundColor: SCANNER_COLORS.action
    },
    analyzeButton: {
        minHeight: SCANNER_LAYOUT.buttonHeight,
        backgroundColor: SCANNER_COLORS.action,
        borderRadius: SCANNER_LAYOUT.borderRadius,
        justifyContent: "center",
        alignItems: "center"
    },
    analyzeLabel: {
        fontSize: SCANNER_LAYOUT.bodyFontSize,
        fontWeight: "600",
        color: SCANNER_COLORS.white
    },
    disabledButton: { backgroundColor: SCANNER_COLORS.disabled },
    disabledLabel: { color: SCANNER_COLORS.secondaryText },
    pressed: { opacity: SCANNER_LAYOUT.pressedOpacity },
    error: {
        color: SCANNER_COLORS.error,
        fontSize: SCANNER_LAYOUT.captionFontSize,
        lineHeight: SCANNER_LAYOUT.captionLineHeight
    },
    result: {
        gap: SCANNER_SPACING.small,
        borderTopWidth: SCANNER_LAYOUT.borderWidth,
        borderTopColor: SCANNER_COLORS.border,
        paddingTop: SCANNER_SPACING.large
    },
    carousel: { gap: SCANNER_SPACING.small },
    reference: {
        width: SCANNER_LAYOUT.referenceWidth,
        gap: SCANNER_SPACING.small
    },
    referenceImage: {
        width: SCANNER_LAYOUT.referenceWidth,
        height: SCANNER_LAYOUT.referenceHeight,
        borderRadius: SCANNER_LAYOUT.borderRadius,
        backgroundColor: SCANNER_COLORS.surface
    },
    viewer: {
        flex: 1,
        backgroundColor: SCANNER_COLORS.viewerBackground
    },
    viewerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SCANNER_SPACING.medium,
        gap: SCANNER_SPACING.medium
    },
    zoomContainer: { flex: 1 },
    zoomViewport: {
        flex: 1,
        overflow: "hidden"
    },
    zoomImage: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    viewerAction: {
        color: SCANNER_COLORS.viewerText,
        fontSize: SCANNER_LAYOUT.bodyFontSize
    },
    viewerFooter: {
        gap: SCANNER_SPACING.small,
        padding: SCANNER_SPACING.medium
    },
    viewerCaption: {
        color: SCANNER_COLORS.viewerText,
        fontSize: SCANNER_LAYOUT.captionFontSize,
        lineHeight: SCANNER_LAYOUT.captionLineHeight,
        textAlign: "center"
    },
    viewerLink: {
        color: SCANNER_COLORS.viewerText,
        fontSize: SCANNER_LAYOUT.captionFontSize,
        textDecorationLine: "underline"
    }
});
