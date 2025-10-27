import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { ThemeProvider } from '../providers/ThemeProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from '../store';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const deviceCount = useStore((state) => state.deviceCount);
  const isHydrated = useStore((state) => state.isHydrated);

  useEffect(() => {
    useStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const inOnboarding = segments[0] === 'onboarding';
    const hasDevices = deviceCount > 0;

    if (!hasDevices && !inOnboarding) {
      router.replace('/onboarding/welcome');
    } else if (hasDevices && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isHydrated, deviceCount, segments]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F4' }}>
        <ActivityIndicator size="large" color="#FF88AA" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="device/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="goal/new" options={{ headerShown: false }} />
      <Stack.Screen name="device/settings" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
