import { Text, View } from "react-native";
import { SCANNER_TEXT } from "../constants/scanner.constant";
import { styles } from "../styles/scanner.style";
import { ScanResultProps } from "../types/scanner.type";

export function ScanResult(props: ScanResultProps)
{
    const { result } = props;

    return (
        <View
            style={styles.result}
            accessibilityLiveRegion="polite"
        >
            <Text style={styles.caption}>
                {SCANNER_TEXT.result}
            </Text>
            <Text style={styles.heading}>
                {result.predicted_class}
            </Text>
        </View>
    );
}
