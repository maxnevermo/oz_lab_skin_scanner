import {
    REFERENCE_PHOTO_LIMIT,
    REFERENCE_PHOTOS_BY_CLASS
} from "../constants/referencePhoto.constant";
import { ReferencePhoto } from "../types/scanner.type";

const CLASS_ALIASES: Record<string, string> = {
    blackhead: "blackheads",
    blackheads: "blackheads",
    "open comedo": "blackheads",
    "open comedones": "blackheads",
    whitehead: "whiteheads",
    whiteheads: "whiteheads",
    "closed comedo": "whiteheads",
    "closed comedones": "whiteheads",
    inflammatory: "inflammatory",
    cyst: "cysts",
    cysts: "cysts"
};

function normalizeClassName(className: string)
{
    return className.trim().toLowerCase().replace(/[_-]+/g, " ");
}

function shufflePhotos(photos: ReferencePhoto[])
{
    const shuffledPhotos = [...photos];

    for (let index = shuffledPhotos.length - 1; index > 0; index -= 1)
    {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentPhoto = shuffledPhotos[index];

        shuffledPhotos[index] = shuffledPhotos[randomIndex];
        shuffledPhotos[randomIndex] = currentPhoto;
    }

    return shuffledPhotos;
}

export function getReferencePhotos(className: string)
{
    const normalizedClassName = normalizeClassName(className);
    const referenceClass = CLASS_ALIASES[normalizedClassName];

    if (!referenceClass)
    {
        return [];
    }

    return shufflePhotos(REFERENCE_PHOTOS_BY_CLASS[referenceClass])
        .slice(0, REFERENCE_PHOTO_LIMIT);
}
