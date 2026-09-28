import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoInput } from "../components/PhotoInput";
import {
    ProgressIndicator
} from "../components/ProgressIndicator";
import { ScanResult } from "../components/ScanResult";
import {
    ReferenceGallery
} from "../components/ReferenceGallery";
import { SCANNER_TEXT } from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import { useScanner } from "../hooks/useScanner";
import { getReferencePhotos } from "../utils/getReferencePhotos";

export function ScannerScreen()
{
    const scanner = useScanner();
    const referencePhotos = useMemo(() => scanner.result
        ? getReferencePhotos(scanner.result.predicted_class)
        : [], [scanner.result]);
    let errorContent = null;
    let resultContent = null;
    let referenceGalleryContent = null;

    if (scanner.error)
    {
        errorContent = (
            <Text accessibilityRole="alert" style={styles.error}>
                {scanner.error}
            </Text>
        );
    }

    if (scanner.result)
    {
        if (referencePhotos.length > 0)
        {
            referenceGalleryContent = (
                <ReferenceGallery
                    key={referencePhotos[0].url}
                    photos={referencePhotos}
                />
            );
        }

        resultContent = (
            <>
                <ScanResult result={scanner.result}/>
                {referenceGalleryContent}
            </>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text role="heading" style={styles.title}>
                        {SCANNER_TEXT.title}
                    </Text>
                    <Text
                        style={styles.caption}>{SCANNER_TEXT.subtitle}</Text>
                </View>
                <ProgressIndicator
                    label={scanner.progressLabel}
                    progress={scanner.progress}
                />
                <View style={styles.analysisControls}>
                    <PhotoInput
                        photo={scanner.photo}
                        isPickingPhoto={scanner.isPickingPhoto || scanner.isAnalyzing}
                        isSavingPhoto={scanner.isSavingPhoto}
                        onSelect={scanner.selectPhoto}
                        onSave={scanner.savePhoto}
                        onRemove={scanner.removePhoto}
                        onLoad={scanner.handlePreviewLoad}
                        onError={scanner.handlePreviewError}
                    />
                    {errorContent}
                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ disabled: !scanner.canAnalyze }}
                        disabled={!scanner.canAnalyze}
                        onPress={scanner.analyzePhoto}
                        style={({ pressed }) => [
                            styles.analyzeButton,
                            !scanner.canAnalyze && styles.disabledButton,
                            pressed && styles.pressed
                        ]}
                    >
                        <Text
                            style={[
                                styles.analyzeLabel,
                                !scanner.canAnalyze && styles.disabledLabel
                            ]}
                        >
                            {scanner.isAnalyzing ? SCANNER_TEXT.analyzing : SCANNER_TEXT.analyze}
                        </Text>
                    </Pressable>
                </View>
                {resultContent}
            </ScrollView>
        </SafeAreaView>
    );
}
