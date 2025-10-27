import { Stack } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../theme";

export default function OnboardingLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.ivory }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
