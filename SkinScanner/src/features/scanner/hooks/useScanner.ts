import { useEffect, useRef, useState } from "react";
import { SCANNER_TEXT } from "../constants/scanner.constant";
import {
    AnalysisResult,
    ImageFormat,
    PhotoSource,
    SelectedPhoto
} from "../types/scanner.type";
import { requestPhotoAnalysis } from "../utils/analyzePhoto";
import { exportPhoto } from "../utils/exportPhoto";
import { pickPhoto } from "../utils/pickPhoto";

export function useScanner()
{
    const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
    const [isPhotoReady, setIsPhotoReady] = useState(false);
    const [isPickingPhoto, setIsPickingPhoto] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSavingPhoto, setIsSavingPhoto] = useState(false);
    const requestController = useRef<AbortController | null>(null);
    const requestVersion = useRef(0);
    const [error, setError] = useState<string | null>(null);
    const pickerInProgress = useRef(false);
    const canAnalyze = photo !== null && isPhotoReady && !isPickingPhoto &&
        !isAnalyzing && !isSavingPhoto;
    let progress = 0;
    let progressLabel: string = SCANNER_TEXT.progressEmpty;

    if (photo)
    {
        progress = isPhotoReady ? 0.5 : 0.25;
        progressLabel = isPhotoReady ? SCANNER_TEXT.progressReady : SCANNER_TEXT.progressLoading;
    }

    if (isAnalyzing)
    {
        progress = 0.75;
        progressLabel = SCANNER_TEXT.progressAnalyzing;
    }

    if (result)
    {
        progress = 1;
        progressLabel = SCANNER_TEXT.progressComplete;
    }

    function replacePhoto(nextPhoto: SelectedPhoto | null)
    {
        requestVersion.current += 1;
        requestController.current?.abort();
        requestController.current = null;
        setIsAnalyzing(false);
        setPhoto(nextPhoto);
        setIsPhotoReady(false);
        setResult(null);
        setError(null);
    }

    async function selectPhoto(source: PhotoSource)
    {
        if (pickerInProgress.current)
        {
            return;
        }

        pickerInProgress.current = true;
        setIsPickingPhoto(true);
        setError(null);

        try
        {
            const selection = await pickPhoto(source);

            if (selection.error)
            {
                setError(selection.error);
            }

            if (selection.photo)
            {
                replacePhoto(selection.photo);
            }
        } finally
        {
            pickerInProgress.current = false;
            setIsPickingPhoto(false);
        }
    }

    function handlePreviewError()
    {
        requestVersion.current += 1;
        requestController.current?.abort();
        requestController.current = null;
        setIsAnalyzing(false);
        setIsPhotoReady(false);
        setResult(null);
        setError(SCANNER_TEXT.previewError);
    }

    async function analyzePhoto()
    {
        if (!photo || !canAnalyze)
        {
            return;
        }

        const version = ++requestVersion.current;
        const controller = new AbortController();
        requestController.current = controller;
        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        try
        {
            const response = await requestPhotoAnalysis(photo, controller.signal);

            if (requestVersion.current === version)
            {
                setResult(response);
            }
        } catch (error)
        {
            if (requestVersion.current === version && !controller.signal.aborted)
            {
                setError(error instanceof TypeError
                    ? SCANNER_TEXT.requestError
                    : error instanceof Error
                        ? error.message
                        : SCANNER_TEXT.requestError);
            }
        } finally
        {
            if (requestVersion.current === version)
            {
                requestController.current = null;
                setIsAnalyzing(false);
            }
        }
    }

    async function savePhoto(format: ImageFormat)
    {
        if (!photo || isSavingPhoto)
        {
            return;
        }

        setIsSavingPhoto(true);
        setError(null);

        try
        {
            await exportPhoto(photo, format);
        } catch (error)
        {
            const message = error instanceof Error &&
            error.message === SCANNER_TEXT.shareUnavailableError
                ? error.message
                : SCANNER_TEXT.saveError;

            setError(message);
        } finally
        {
            setIsSavingPhoto(false);
        }
    }

    useEffect(() => () => requestController.current?.abort(), []);

    return {
        photo,
        result,
        error,
        canAnalyze,
        progress,
        progressLabel,
        isPickingPhoto,
        isAnalyzing,
        isSavingPhoto,
        selectPhoto,
        analyzePhoto,
        savePhoto,
        handlePreviewError,
        handlePreviewLoad: () => setIsPhotoReady(true),
        removePhoto: () => replacePhoto(null)
    };
}
