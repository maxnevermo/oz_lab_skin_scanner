import { ReferencePhoto } from "../types/scanner.type";

type ReferencePhotoDefinition = {
    imageUrl: string;
    referenceUrl: string;
    credit: string;
    license: string;
    licenseUrl: string;
};

const LICENSE_URLS = {
    ccByFour: "https://creativecommons.org/licenses/by/4.0/",
    ccByTwo: "https://creativecommons.org/licenses/by/2.0/",
    ccByTwoPointFive: "https://creativecommons.org/licenses/by/2.5/",
    ccBySaFour: "https://creativecommons.org/licenses/by-sa/4.0/",
    ccBySaThree: "https://creativecommons.org/licenses/by-sa/3.0/",
    publicDomain: "https://creativecommons.org/publicdomain/mark/1.0/"
} as const;

const blackheadDefinitions: ReferencePhotoDefinition[] = [
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/BlackHead.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:BlackHead.jpg",
        credit: "Bryancalabro",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Blackheads%20by%20David%20Shankbone.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Blackheads%20by%20David%20Shankbone.jpg",
        credit: "David Shankbone",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Comedones.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Comedones.jpg",
        credit: "Hilda Bastian",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Comedos%20Nose%2001.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Comedos%20Nose%2001.jpg",
        credit: "M. Sand et al.",
        license: "CC BY 2.0",
        licenseUrl: LICENSE_URLS.ccByTwo
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Acne%20comedonica%2C%20Stirn%2C%20%C2%A9WIKIDERM.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Acne%20comedonica%2C%20Stirn%2C%20%C2%A9WIKIDERM.jpg",
        credit: "Dr. Thomas Brinkmeier / WIKIDERM",
        license: "CC BY 4.0",
        licenseUrl: LICENSE_URLS.ccByFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fox%20Plate%20III.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Fox%20Plate%20III.jpg",
        credit: "George Henry Fox",
        license: "Public domain",
        licenseUrl: LICENSE_URLS.publicDomain
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Komedo.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Komedo.jpg",
        credit: "Etorofu island",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nose%20with%20Blackhead%202009.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Nose%20with%20Blackhead%202009.jpg",
        credit: "LBPics",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    }
];

const whiteheadDefinitions: ReferencePhotoDefinition[] = [
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Closedcomedos.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Closedcomedos.jpg",
        credit: "Michael Sand et al.",
        license: "CC BY 2.5",
        licenseUrl: LICENSE_URLS.ccByTwoPointFive
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Reddish%20zit.png?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Reddish%20zit.png",
        credit: "Aparrotly",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/FDA%20--%20Follicle3.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:FDA%20--%20Follicle3.jpg",
        credit: "U.S. Food and Drug Administration",
        license: "Public domain",
        licenseUrl: LICENSE_URLS.publicDomain
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Blausen%200811%20SkinPores.png?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Blausen%200811%20SkinPores.png",
        credit: "BruceBlaus / Blausen Medical",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/"
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Comedones.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Comedones.jpg",
        credit: "Hilda Bastian",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Acne%20comedonica%2C%20Stirn%2C%20%C2%A9WIKIDERM.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Acne%20comedonica%2C%20Stirn%2C%20%C2%A9WIKIDERM.jpg",
        credit: "Dr. Thomas Brinkmeier / WIKIDERM",
        license: "CC BY 4.0",
        licenseUrl: LICENSE_URLS.ccByFour
    }
];

const inflammatoryDefinitions: ReferencePhotoDefinition[] = [
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Acne%20papulopustulosa%2C%20Decollet%C3%A9%2C%20%C2%A9WIKIDERM.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Acne%20papulopustulosa%2C%20Decollet%C3%A9%2C%20%C2%A9WIKIDERM.jpg",
        credit: "Dr. Thomas Brinkmeier / WIKIDERM",
        license: "CC BY 4.0",
        licenseUrl: LICENSE_URLS.ccByFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pimples.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Pimples.jpg",
        credit: "Alexander Hovanec",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pimples-human-boy.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Pimples-human-boy.jpg",
        credit: "Thagavaluzhavan",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Botons%20d'%20djonnesse%20djonnete%2020%20ans.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Botons%20d'%20djonnesse%20djonnete%2020%20ans.jpg",
        credit: "Lucyin",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Acnevulgaris.png?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Acnevulgaris.png",
        credit: "Joseph Josephson",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fox%20Plate%20I.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Fox%20Plate%20I.jpg",
        credit: "George Henry Fox",
        license: "Public domain",
        licenseUrl: LICENSE_URLS.publicDomain
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Orange-Skin-Effected%20by%20Acne.JPG?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Orange-Skin-Effected%20by%20Acne.JPG",
        credit: "PersianDutchNetwork",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Backacne%20modified.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Backacne%20modified.jpg",
        credit: "James Heilman, MD",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fox%20Plate%20II.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Fox%20Plate%20II.jpg",
        credit: "George Henry Fox",
        license: "Public domain",
        licenseUrl: LICENSE_URLS.publicDomain
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Acne%20blood.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Acne%20blood.jpg",
        credit: "Winkpolve",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    }
];

const cystDefinitions: ReferencePhotoDefinition[] = [
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cysticacne-cropped.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:Cysticacne-cropped.jpg",
        credit: "James Heilman, MD",
        license: "CC BY-SA 3.0",
        licenseUrl: LICENSE_URLS.ccBySaThree
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2001.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2001.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2004.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2004.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2006.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2006.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2007.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2007.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2009.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2009.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2012.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2012.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    },
    {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2015.jpg?width=960",
        referenceUrl: "https://commons.wikimedia.org/wiki/File:%C3%9Czd%C9%99%20d%C3%BCy%C3%BCnl%C3%BC%20v%C9%99%20kistik%20s%C4%B1zanaqlar%20(Acne%20Vulgaris)%2015.jpg",
        credit: "Sedef94",
        license: "CC BY-SA 4.0",
        licenseUrl: LICENSE_URLS.ccBySaFour
    }
];

function createReferencePhotos(lesionType: string, definitions: ReferencePhotoDefinition[]): ReferencePhoto[]
{
    return definitions.map((definition) =>
    {
        return {
            source: {
                uri: definition.imageUrl
            },
            detail: `${lesionType} reference image`,
            credit: definition.credit,
            license: definition.license,
            licenseUrl: definition.licenseUrl,
            url: definition.referenceUrl
        };
    });
}

export const REFERENCE_PHOTOS_BY_CLASS: Record<string, ReferencePhoto[]> = {
    blackheads: createReferencePhotos("Blackhead", blackheadDefinitions),
    whiteheads: createReferencePhotos("Whitehead", whiteheadDefinitions),
    inflammatory: createReferencePhotos("Inflammatory acne", inflammatoryDefinitions),
    cysts: createReferencePhotos("Cyst", cystDefinitions)
};

export const REFERENCE_PHOTO_LIMIT = 6;
