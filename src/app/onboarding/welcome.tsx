import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { PiggyButton } from '../../components/PiggyButton';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🐷</Text>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          Välkommen till DigiPiggy
        </Text>
        <Text
          style={[
            styles.subtitle,
            theme.typography.body,
            { color: theme.colors.textMuted },
          ]}
        >
          Den digitala spargrisen som hjälper barn att spara till sina drömmar
        </Text>
      </View>
      <View style={styles.footer}>
        <PiggyButton
          title="Kom igång"
          onPress={() => router.push('/onboarding/bluetooth')}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 120,
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 32,
  },
});
