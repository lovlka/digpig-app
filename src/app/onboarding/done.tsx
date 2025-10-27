import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { PiggyButton } from '../../components/PiggyButton';

export default function SetupDoneScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          Klart!
        </Text>
        <Text
          style={[
            styles.subtitle,
            theme.typography.body,
            { color: theme.colors.textMuted },
          ]}
        >
          Din DigiPiggy är nu ansluten och redo att användas
        </Text>
      </View>
      <View style={styles.footer}>
        <PiggyButton
          title="Gå till appen"
          onPress={handleContinue}
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
    fontSize: 100,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 32,
  },
});
