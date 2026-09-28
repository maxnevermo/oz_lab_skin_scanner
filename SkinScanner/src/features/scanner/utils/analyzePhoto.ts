import { fetch as expoFetch } from "expo/fetch";
import { File as ExpoFile } from "expo-file-system";
import {
    AnalysisResult,
    SelectedPhoto
} from "../types/scanner.type";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.123:8000").replace(/\/$/, "");

function isAnalysisResult(value: unknown): value is AnalysisResult
{
    if (typeof value !== "object" || value === null)
    {
        return false;
    }

    const record = value as Record<string, unknown>;

    return typeof record.predicted_class === "string" &&
        record.predicted_class.trim().length > 0;
}

export async function requestPhotoAnalysis(photo: SelectedPhoto, signal: AbortSignal): Promise<AnalysisResult>
{
    const body = new FormData();

    const file = new ExpoFile(photo.uri);

    if (!file.exists)
    {
        throw new Error(
            "Selected photo is no longer available."
        );
    }

    body.append("file", file as unknown as Blob);

    const url = `${API_BASE_URL}/analyze-face`;

    const response = await expoFetch(url, {
        method: "POST",
        body,
        signal
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok)
    {
        const detail = (
            typeof payload === "object" &&
            payload !== null &&
            "detail" in payload &&
            typeof payload.detail === "string"
        )
            ? payload.detail
            : "The server could not analyze this photo.";

        throw new Error(detail);
    }

    if (typeof payload === "string" && payload.trim())
    {
        return { predicted_class: payload.trim() };
    }

    if (!isAnalysisResult(payload))
    {
        throw new Error(
            "Unexpected response from the analysis server."
        );
    }

    return { predicted_class: payload.predicted_class.trim() };
}
