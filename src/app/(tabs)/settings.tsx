import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeProvider';
import { Card } from '../../components/Card';
import { PiggyButton } from '../../components/PiggyButton';
import { useStore } from '../../store';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const deviceStore = useStore((state) => state.devices);
  const devices = Object.values(deviceStore);

  const handleClearData = () => {
    Alert.alert(
      'Rensa data',
      'Är du säker på att du vill ta bort all data? Detta kan inte ångras.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Rensa',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Exportera data', 'Denna funktion är under utveckling');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          Inställningar
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.title, { color: theme.colors.text }]}>
            Mina enheter
          </Text>
          {devices.map((device) => (
            <Card
              key={device.id}
              onPress={() => router.push(`/device/settings?id=${device.id}`)}
              style={styles.deviceCard}
            >
              <View style={styles.deviceRow}>
                <MaterialIcons name="settings" size={24} color={theme.colors.textMuted} />
                <Text style={[styles.deviceName, theme.typography.body, { color: theme.colors.text }]}>
                  {device.name}
                </Text>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.title, { color: theme.colors.text }]}>
            Data
          </Text>
          <PiggyButton
            title="Exportera data"
            onPress={handleExportData}
            variant="secondary"
            style={styles.button}
          />
          <PiggyButton
            title="Rensa demo-data"
            onPress={handleClearData}
            variant="ghost"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.title, { color: theme.colors.text }]}>
            Om appen
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            DigiPiggy v1.0.0
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 8 }]}>
            Den digitala spargrisen för hela familjen
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  deviceCard: {
    marginBottom: 8,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    flex: 1,
    marginLeft: 12,
  },
  button: {
    marginBottom: 12,
  },
});
