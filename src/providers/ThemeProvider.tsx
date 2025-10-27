import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import {
  Baloo2_700Bold,
  Baloo2_600SemiBold,
} from '@expo-google-fonts/baloo-2';
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';
import { RubikMonoOne_400Regular } from '@expo-google-fonts/rubik-mono-one';
import * as SplashScreen from 'expo-splash-screen';
import { theme, Theme } from '../theme';

SplashScreen.preventAutoHideAsync();

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    Baloo2_700Bold,
    Baloo2_600SemiBold,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    RubikMonoOne_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
