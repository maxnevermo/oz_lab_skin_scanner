import { SCANNER_TEXT } from "../constants/scanner.constant";
import { SelectedPhoto } from "../types/scanner.type";

function formatFileSize(size?: number)
{
    if (size === undefined)
    {
        return SCANNER_TEXT.unknownValue;
    }

    if (size < 1024)
    {
        return `${size} B`;
    }

    if (size < 1024 * 1024)
    {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getExtension(name: string)
{
    const extension = name.split(".").pop();

    return extension && extension !== name
        ? extension.toUpperCase()
        : SCANNER_TEXT.unknownValue;
}

export function formatPhotoMetadata(photo: SelectedPhoto)
{
    return [
        `${SCANNER_TEXT.fileSize}: ${formatFileSize(photo.size)}`,
        `${SCANNER_TEXT.dimensions}: ${photo.width} × ${photo.height} px`,
        `${SCANNER_TEXT.fileExtension}: ${getExtension(photo.name)}`
    ].join("\n");
}
