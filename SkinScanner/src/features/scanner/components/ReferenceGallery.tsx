import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { PhotoViewer } from "./PhotoViewer";
import { SCANNER_TEXT } from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import { ReferenceGalleryProps } from "../types/scanner.type";

export function ReferenceGallery(props: ReferenceGalleryProps)
{
    const { photos } = props;
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    let viewerContent = null;

    if (selectedIndex !== null)
    {
        viewerContent = (
            <PhotoViewer
                photos={photos}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onClose={() => setSelectedIndex(null)}
            />
        );
    }

    return (
        <View style={styles.section}>
            <Text
                style={styles.heading}>{SCANNER_TEXT.referencePhotos}
            </Text>
            <Text
                style={styles.caption}>{SCANNER_TEXT.referenceHint}
            </Text>
            <ScrollView
                horizontal
                contentContainerStyle={styles.carousel}
                showsHorizontalScrollIndicator={false}>
                {photos.map((photo, index) => (
                    <Pressable
                        key={photo.url}
                        accessibilityRole="button"
                        onPress={() => setSelectedIndex(index)}
                        style={styles.reference}
                    >
                        <Image
                            source={photo.source}
                            style={styles.referenceImage}
                            contentFit="cover"
                        />
                    </Pressable>
                ))}
            </ScrollView>
            <Text
                style={styles.caption}>{SCANNER_TEXT.referenceNotice}
            </Text>
            {viewerContent}
        </View>
    );
}
