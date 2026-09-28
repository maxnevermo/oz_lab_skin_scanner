export const PHOTO_SOURCE = {
    camera: "camera",
    gallery: "gallery",
    files: "files"
} as const;

export const IMAGE_FORMAT = {
    jpeg: "jpeg",
    png: "png",
    bmp: "bmp"
} as const;

export const SCANNER_TEXT = {
    title: "SkinScanner",
    subtitle: "Photo analysis",
    photoHint: "Use a clear, close-up photo in good light.",
    photoSources: "Camera, gallery or files",
    photoPlaceholder: "Photo preview area",
    emptyPhoto: "No photo selected",
    instruction: "Tap the area to upload a photo",
    viewPhoto: "Tap to view and zoom",
    openPhoto: "Open selected photo full screen",
    openingPhoto: "Opening photo…",
    takePhoto: "Take photo",
    chooseGallery: "Choose from gallery",
    chooseFiles: "Choose from files",
    removePhoto: "Remove photo",
    savePhoto: "Save image",
    savingPhoto: "Preparing image…",
    saveAsJpeg: "Save as JPG",
    saveAsPng: "Save as PNG",
    saveAsBmp: "Save as BMP",
    imageInformation: "Image information",
    fileSize: "File size",
    dimensions: "Resolution",
    fileExtension: "Extension",
    unknownValue: "Unknown",
    selectedPhoto: "Selected photo",
    analyze: "Analyze",
    analyzing: "Uploading and analyzing…",
    progressLabel: "Analysis progress",
    progressEmpty: "Step 0 of 2 — select a photo",
    progressLoading: "Loading the selected photo…",
    progressReady: "Step 1 of 2 — ready to analyze",
    progressAnalyzing: "Step 2 of 2 — analyzing photo",
    progressComplete: "Step 2 of 2 — analysis complete",
    requestError: "Cannot reach the API. Check EXPO_PUBLIC_API_URL and that the backend is running.",
    result: "Result",
    referencePhotos: "Reference photos",
    referenceHint: "Examples of the predicted lesion type. Tap an image to enlarge it.",
    referenceNotice: "Reference images may contain more than one lesion type.",
    cameraPermissionError:
        "Camera access is disabled. Allow it in device settings or choose an existing photo.",
    selectionError: "Could not open the photo. Please try another image.",
    invalidImageError: "Please choose an image file.",
    previewError: "Could not display this image. Try a JPG or PNG file.",
    saveError: "Could not prepare this image for saving.",
    shareUnavailableError: "Image saving is not available on this device.",
    close: "Close",
    source: "Original photo",
    resized: "Resized for display"
} as const;

export const PHOTO_SOURCE_OPTIONS = [
    { id: PHOTO_SOURCE.camera, title: SCANNER_TEXT.takePhoto },
    {
        id: PHOTO_SOURCE.gallery,
        title: SCANNER_TEXT.chooseGallery
    },
    { id: PHOTO_SOURCE.files, title: SCANNER_TEXT.chooseFiles }
];

export const IMAGE_FORMAT_OPTIONS = [
    { id: IMAGE_FORMAT.jpeg, title: SCANNER_TEXT.saveAsJpeg },
    { id: IMAGE_FORMAT.png, title: SCANNER_TEXT.saveAsPng },
    { id: IMAGE_FORMAT.bmp, title: SCANNER_TEXT.saveAsBmp }
];

export const IMAGE_FORMAT_DETAILS = {
    [IMAGE_FORMAT.jpeg]: {
        extension: "jpg",
        mimeType: "image/jpeg",
        uti: "public.jpeg"
    },
    [IMAGE_FORMAT.png]: {
        extension: "png",
        mimeType: "image/png",
        uti: "public.png"
    },
    [IMAGE_FORMAT.bmp]: {
        extension: "bmp",
        mimeType: "image/bmp",
        uti: "com.microsoft.bmp"
    }
} as const;

export const SCANNER_COLORS = {
    background: "#F8F9FB",
    white: "#FFFFFF",
    surface: "#F0F3F7",
    text: "#202B3B",
    secondaryText: "#677387",
    border: "#D5DCE5",
    action: "#34587E",
    disabled: "#E1E6EC",
    error: "#B3261E",
    viewerBackground: "#111111",
    viewerText: "#FFFFFF"
} as const;

export const SCANNER_SPACING = {
    extraSmall: 4,
    small: 8,
    medium: 16,
    large: 24
} as const;

export const SCANNER_LAYOUT = {
    contentWidth: 560,
    iconSize: 32,
    placeholderWidth: 240,
    photoAspectRatio: 4 / 3,
    referenceWidth: 160,
    referenceHeight: 120,
    buttonHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    titleFontSize: 28,
    headingFontSize: 18,
    bodyFontSize: 16,
    captionFontSize: 13,
    bodyLineHeight: 24,
    captionLineHeight: 20,
    pressedOpacity: 0.7
} as const;

export const IMAGE_FILE_TYPE = "image/*";
export const IMAGE_MIME_PREFIX = "image/";

export const PHOTO_ZOOM = {
    minimum: 1,
    maximum: 4,
    pinchTouchCount: 2
} as const;

export const PHOTO_SWIPE = {
    minimumDistance: 60,
    horizontalDominance: 1.25
} as const;
