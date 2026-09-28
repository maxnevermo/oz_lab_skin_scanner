import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScannerScreen } from "./features/scanner/screens/ScannerScreen";

export function App()
{
    return (
        <SafeAreaProvider>
            <StatusBar style="dark"/>
            <ScannerScreen/>
        </SafeAreaProvider>
    );
}
