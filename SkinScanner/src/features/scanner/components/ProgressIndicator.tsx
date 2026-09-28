import { Text, View } from "react-native";
import { SCANNER_TEXT } from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import { ProgressIndicatorProps } from "../types/scanner.type";

export function ProgressIndicator(props: ProgressIndicatorProps)
{
    const { label, progress } = props;
    const percentage = Math.round(progress * 100);
    const progressWidth = `${percentage}%` as `${number}%`;

    return (
        <View
            accessibilityLabel={SCANNER_TEXT.progressLabel}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: percentage, text: label }}
            style={styles.progressSection}
        >
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: progressWidth }]}/>
            </View>
            <Text style={styles.caption}>{label}</Text>
        </View>
    );
}
