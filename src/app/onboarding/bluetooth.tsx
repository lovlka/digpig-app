import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { PiggyButton } from '../../components/PiggyButton';
import { Card } from '../../components/Card';
import { BleService } from '../../services/BleService';
import { BleDevice } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';

export default function BluetoothPairingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [pairing, setPairing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanDevices = async () => {
    setScanning(true);
    setError(null);
    try {
      const found = await BleService.scan();
      setDevices(found);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    scanDevices();
  }, []);

  const handlePair = async (device: BleDevice) => {
    setPairing(device.id);
    setError(null);
    try {
      await BleService.pair(device.id);
      router.push({
        pathname: '/onboarding/wifi',
        params: { deviceId: device.id, deviceName: device.name },
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPairing(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h2, { color: theme.colors.text }]}>
          Hitta din DigiPiggy
        </Text>
        <Text style={[styles.subtitle, theme.typography.body, { color: theme.colors.textMuted }]}>
          Aktivera Bluetooth och sätt på din spargris
        </Text>
      </View>

      {error && (
        <Card style={StyleSheet.flatten([styles.errorCard, { backgroundColor: '#FFE5E5' }]) as any}>
          <Text style={[theme.typography.body, { color: '#D32F2F' }]}>{error}</Text>
        </Card>
      )}

      {scanning ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.piggyPink} />
          <Text style={[styles.loadingText, theme.typography.body, { color: theme.colors.textMuted }]}>
            Söker efter enheter...
          </Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="bluetooth-disabled" size={64} color={theme.colors.textMuted} />
          <Text style={[styles.emptyText, theme.typography.body, { color: theme.colors.textMuted }]}>
            Inga enheter hittades
          </Text>
          <PiggyButton
            title="Sök igen"
            onPress={scanDevices}
            variant="secondary"
            style={styles.retryButton}
          />
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.deviceCard}>
              <View style={styles.deviceRow}>
                <View style={styles.deviceInfo}>
                  <MaterialIcons name="bluetooth" size={24} color={theme.colors.skyBlue} />
                  <Text style={[styles.deviceName, theme.typography.title, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                </View>
                <PiggyButton
                  title={pairing === item.id ? 'Ansluter...' : 'Para'}
                  onPress={() => handlePair(item)}
                  variant="primary"
                  loading={pairing === item.id}
                  disabled={!!pairing}
                />
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.footer}>
        <PiggyButton
          title="Sök igen"
          onPress={scanDevices}
          variant="ghost"
          disabled={scanning}
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  list: {
    paddingBottom: 16,
  },
  deviceCard: {
    marginBottom: 12,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceName: {
    marginLeft: 12,
  },
  footer: {
    paddingTop: 16,
  },
});
