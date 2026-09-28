import { File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { decode } from "jpeg-js";
import {
    IMAGE_FORMAT,
    IMAGE_FORMAT_DETAILS,
    SCANNER_TEXT
} from "../constants/scanner.constant";
import { ImageFormat, SelectedPhoto } from "../types/scanner.type";

function encodeBitmap(data: Uint8Array, width: number, height: number)
{
    const headerSize = 54;
    const rowSize = Math.ceil(width * 3 / 4) * 4;
    const pixelDataSize = rowSize * height;
    const bitmap = new Uint8Array(headerSize + pixelDataSize);
    const header = new DataView(bitmap.buffer);

    bitmap[0] = 0x42;
    bitmap[1] = 0x4d;
    header.setUint32(2, bitmap.length, true);
    header.setUint32(10, headerSize, true);
    header.setUint32(14, 40, true);
    header.setInt32(18, width, true);
    header.setInt32(22, height, true);
    header.setUint16(26, 1, true);
    header.setUint16(28, 24, true);
    header.setUint32(34, pixelDataSize, true);
    header.setInt32(38, 2835, true);
    header.setInt32(42, 2835, true);

    for (let outputY = 0; outputY < height; outputY += 1)
    {
        const sourceY = height - outputY - 1;
        const outputRow = headerSize + outputY * rowSize;

        for (let x = 0; x < width; x += 1)
        {
            const sourceOffset = (sourceY * width + x) * 4;
            const outputOffset = outputRow + x * 3;

            bitmap[outputOffset] = data[sourceOffset + 2];
            bitmap[outputOffset + 1] = data[sourceOffset + 1];
            bitmap[outputOffset + 2] = data[sourceOffset];
        }
    }

    return bitmap;
}

function getExportName(name: string, extension: string)
{
    const baseName = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

    return `${baseName || "SkinScanner-photo"}.${extension}`;
}

async function createBitmap(photo: SelectedPhoto, destination: File)
{
    const context = ImageManipulator.manipulate(photo.uri);
    const renderedImage = await context.renderAsync();
    const jpegImage = await renderedImage.saveAsync({
        format: SaveFormat.JPEG,
        compress: 1
    });
    const jpegBytes = await new File(jpegImage.uri).bytes();
    const decodedImage = decode(jpegBytes, { useTArray: true });
    const bitmap = encodeBitmap(
        decodedImage.data,
        decodedImage.width,
        decodedImage.height
    );

    destination.create({ overwrite: true });
    destination.write(bitmap);
}

async function createJpegOrPng(
    photo: SelectedPhoto,
    format: ImageFormat,
    destination: File
)
{
    const context = ImageManipulator.manipulate(photo.uri);
    const renderedImage = await context.renderAsync();
    const convertedImage = await renderedImage.saveAsync({
        format: format === IMAGE_FORMAT.jpeg ? SaveFormat.JPEG : SaveFormat.PNG,
        compress: 1
    });

    await new File(convertedImage.uri).copy(destination, { overwrite: true });
}

export async function exportPhoto(photo: SelectedPhoto, format: ImageFormat)
{
    const isSharingAvailable = await isAvailableAsync();

    if (!isSharingAvailable)
    {
        throw new Error(SCANNER_TEXT.shareUnavailableError);
    }

    const formatDetails = IMAGE_FORMAT_DETAILS[format];
    const destination = new File(
        Paths.cache,
        getExportName(photo.name, formatDetails.extension)
    );

    if (format === IMAGE_FORMAT.bmp)
    {
        await createBitmap(photo, destination);
    }
    else
    {
        await createJpegOrPng(photo, format, destination);
    }

    await shareAsync(destination.uri, {
        UTI: formatDetails.uti,
        mimeType: formatDetails.mimeType
    });
}
