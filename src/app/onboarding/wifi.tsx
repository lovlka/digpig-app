import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { PiggyButton } from '../../components/PiggyButton';
import { Card } from '../../components/Card';
import { WifiService } from '../../services/WifiService';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { generateId } from '../../utils/format';

export default function WiFiSetupScreen() {
  const { deviceId, deviceName } = useLocalSearchParams<{ deviceId: string; deviceName: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const addDevice = useStore((state) => state.addDevice);

  const [networks, setNetworks] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState<string>('');
  const [password, setPassword] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualSsid, setManualSsid] = useState('');
  const [showManual, setShowManual] = useState(false);

  const scanNetworks = async () => {
    setScanning(true);
    setError(null);
    try {
      const found = await WifiService.scan();
      setNetworks(found);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    scanNetworks();
  }, []);

  const handleConnect = async () => {
    const ssid = showManual ? manualSsid : selectedSsid;
    if (!ssid || !password) {
      setError('Fyll i både nätverksnamn och lösenord');
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      await WifiService.connect(ssid, password);

      const newDevice = {
        id: deviceId || generateId(),
        name: deviceName || 'DigiPiggy',
        balance: 0,
        wifiStatus: 'connected' as const,
        bleStatus: 'paired' as const,
        goals: [],
        createdAt: new Date().toISOString(),
      };
      addDevice(newDevice);

      router.push('/onboarding/done');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h2, { color: theme.colors.text }]}>
          Anslut till Wi-Fi
        </Text>
        <Text style={[styles.subtitle, theme.typography.body, { color: theme.colors.textMuted }]}>
          Välj ditt nätverk och ange lösenord
        </Text>
      </View>

      {error && (
        <Card style={StyleSheet.flatten([styles.errorCard, { backgroundColor: '#FFE5E5' }]) as any}>
          <Text style={[theme.typography.body, { color: '#D32F2F' }]}>{error}</Text>
        </Card>
      )}

      {showManual ? (
        <View style={styles.manualForm}>
          <TextInput
            style={[
              styles.input,
              theme.typography.body,
              {
                backgroundColor: '#FFFFFF',
                borderColor: theme.colors.line,
                color: theme.colors.text,
              },
            ]}
            placeholder="Nätverksnamn (SSID)"
            placeholderTextColor={theme.colors.textMuted}
            value={manualSsid}
            onChangeText={setManualSsid}
            autoCapitalize="none"
          />
          <TextInput
            style={[
              styles.input,
              theme.typography.body,
              {
                backgroundColor: '#FFFFFF',
                borderColor: theme.colors.line,
                color: theme.colors.text,
              },
            ]}
            placeholder="Lösenord"
            placeholderTextColor={theme.colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <PiggyButton
            title="Växla till lista"
            onPress={() => setShowManual(false)}
            variant="ghost"
            style={styles.toggleButton}
          />
        </View>
      ) : (
        <>
          {scanning ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={theme.colors.skyBlue} />
              <Text style={[styles.loadingText, theme.typography.body, { color: theme.colors.textMuted }]}>
                Söker efter nätverk...
              </Text>
            </View>
          ) : (
            <FlatList
              data={networks}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Card
                  onPress={() => setSelectedSsid(item)}
                  style={StyleSheet.flatten([
                    styles.networkCard,
                    selectedSsid === item && {
                      borderColor: theme.colors.skyBlue,
                      borderWidth: 2,
                    },
                  ]) as any}
                >
                  <View style={styles.networkRow}>
                    <MaterialIcons name="wifi" size={24} color={theme.colors.skyBlue} />
                    <Text style={[styles.networkName, theme.typography.body, { color: theme.colors.text }]}>
                      {item}
                    </Text>
                    {selectedSsid === item && (
                      <MaterialIcons name="check-circle" size={24} color={theme.colors.mint} />
                    )}
                  </View>
                </Card>
              )}
              contentContainerStyle={styles.list}
            />
          )}
          <PiggyButton
            title="Ange manuellt"
            onPress={() => setShowManual(true)}
            variant="ghost"
            style={styles.toggleButton}
          />
        </>
      )}

      {(selectedSsid || showManual) && (
        <View style={styles.passwordSection}>
          {!showManual && (
            <TextInput
              style={[
                styles.input,
                theme.typography.body,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.line,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Ange lösenord"
              placeholderTextColor={theme.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          )}
          <PiggyButton
            title={connecting ? 'Ansluter...' : 'Anslut'}
            onPress={handleConnect}
            variant="primary"
            loading={connecting}
            disabled={connecting}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {},
  errorCard: {
    marginBottom: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  list: {
    paddingBottom: 16,
  },
  networkCard: {
    marginBottom: 8,
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkName: {
    marginLeft: 12,
    flex: 1,
  },
  manualForm: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  passwordSection: {
    paddingTop: 16,
  },
  toggleButton: {
    marginTop: 8,
  },
});
