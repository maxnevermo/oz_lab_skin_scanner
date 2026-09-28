import { ReactNode } from "react";
import { ImageSource } from "expo-image";
import {
    IMAGE_FORMAT,
    PHOTO_SOURCE
} from "../constants/scanner.constant";

export type PhotoSource = (typeof PHOTO_SOURCE)[keyof typeof PHOTO_SOURCE];

export type SelectedPhoto = {
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
    width: number;
    height: number;
};

export type ImageFormat = (typeof IMAGE_FORMAT)[keyof typeof IMAGE_FORMAT];

export type PhotoSelection = {
    photo: SelectedPhoto | null;
    error?: string
};

export type PhotoSourceMenuProps = {
    children: ReactNode;
    disabled: boolean;
    onSelect: (source: PhotoSource) => void;
};

export type ReferencePhoto = {
    source: ImageSource;
    detail: string;
    credit: string;
    license: string;
    licenseUrl: string;
    url: string;
};

export type AnalysisResult = {
    predicted_class: string;
};

export type PhotoInputProps = {
    photo: SelectedPhoto | null;
    isPickingPhoto: boolean;
    isSavingPhoto: boolean;
    onSelect: (source: PhotoSource) => void;
    onSave: (format: ImageFormat) => void;
    onRemove: () => void;
    onLoad: () => void;
    onError: () => void;
};

export type PhotoExportMenuProps = {
    disabled: boolean;
    onSave: (format: ImageFormat) => void;
};

export type PhotoInfoButtonProps = {
    photo: SelectedPhoto;
};

export type ProgressIndicatorProps = {
    label: string;
    progress: number;
};

export type ReferenceGalleryProps = {
    photos: ReferencePhoto[];
};

export type ScanResultProps = {
    result: AnalysisResult;
};

export type PhotoViewerProps = {
    photos: ViewerPhoto[];
    selectedIndex: number;
    onSelect?: (index: number) => void;
    onClose: () => void;
};

export type ViewerPhoto =
    Pick<ReferencePhoto, "source" | "detail"> | ReferencePhoto;

export type PhotoTransform = {
    scale: number;
    offsetX: number;
    offsetY: number;
};

export type PhotoSize = { width: number; height: number };

export type PhotoNavigation = {
    onSwipePrevious?: () => void;
    onSwipeNext?: () => void;
};

export type ZoomablePhotoProps = PhotoNavigation & {
    photo: ViewerPhoto
};
