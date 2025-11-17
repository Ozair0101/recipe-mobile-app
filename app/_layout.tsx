import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, Stack } from 'expo-router';
import 'react-native-reanimated';
import { ClerkProvider } from '@clerk/clerk-expo';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors'

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
   <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <SafeAreaView style={{flex:1, backgroundColor: COLORS.background}}>
        <Slot/>
      </SafeAreaView>
    </ClerkProvider>
  );
}
