import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { Card } from '../../components/Card';
import { PiggyButton } from '../../components/PiggyButton';
import { StatusIndicator } from '../../components/StatusIndicator';
import { useStore } from '../../store';
import { MaterialIcons } from '@expo/vector-icons';

export default function DeviceSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const device = useStore((state) => state.devices[id]);
  const updateDevice = useStore((state) => state.updateDevice);
  const removeDevice = useStore((state) => state.removeDevice);

  const [name, setName] = useState(device?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!device) {
    return null;
  }

  const handleSaveName = () => {
    if (!name.trim()) {
      Alert.alert('Felaktigt namn', 'Namnet kan inte vara tomt');
      return;
    }
    updateDevice(id, { name: name.trim() });
    setIsEditing(false);
  };

  const handleTestConnection = () => {
    Alert.alert('Testanslutning', 'Anslutningen är OK!');
  };

  const handleReconnectWifi = () => {
    Alert.alert('Återanslut Wi-Fi', 'Denna funktion är under utveckling');
  };

  const handleForgetDevice = () => {
    Alert.alert(
      'Glöm enhet',
      'Är du säker på att du vill ta bort denna enhet? All data kommer försvinna.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: () => {
            removeDevice(id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, theme.typography.h2, { color: theme.colors.text }]}>
            Enhetsinställningar
          </Text>
        </View>

        <Card style={styles.section}>
          <Text style={[styles.label, theme.typography.bodyBold, { color: theme.colors.text }]}>
            Enhetens namn
          </Text>
          {isEditing ? (
            <View>
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
                value={name}
                onChangeText={setName}
              />
              <View style={styles.editButtons}>
                <PiggyButton
                  title="Avbryt"
                  onPress={() => {
                    setName(device.name);
                    setIsEditing(false);
                  }}
                  variant="ghost"
                  style={styles.editButton}
                />
                <PiggyButton
                  title="Spara"
                  onPress={handleSaveName}
                  variant="primary"
                  style={styles.editButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>
                {device.name}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <MaterialIcons name="edit" size={24} color={theme.colors.skyBlue} />
              </TouchableOpacity>
            </View>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.label, theme.typography.bodyBold, { color: theme.colors.text }]}>
            Anslutningsstatus
          </Text>
          <View style={styles.statusRow}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Wi-Fi:
            </Text>
            <View style={styles.statusValue}>
              <StatusIndicator type="wifi" status={device.wifiStatus} />
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                {device.wifiStatus === 'connected' ? 'Ansluten' : 'Frånkopplad'}
              </Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Bluetooth:
            </Text>
            <View style={styles.statusValue}>
              <StatusIndicator type="bluetooth" status={device.bleStatus} />
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                {device.bleStatus === 'paired' ? 'Ihopparad' : 'Frånkopplad'}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.label, theme.typography.bodyBold, { color: theme.colors.text }]}>
            Enhetsinformation
          </Text>
          <View style={styles.infoRow}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              ID:
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>
              {device.id.slice(0, 12)}...
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Skapad:
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>
              {new Date(device.createdAt).toLocaleDateString('sv-SE')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Firmware:
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>
              v1.2.3 (mock)
            </Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <PiggyButton
            title="Testa anslutning"
            onPress={handleTestConnection}
            variant="secondary"
            style={styles.actionButton}
          />
          <PiggyButton
            title="Återanslut Wi-Fi"
            onPress={handleReconnectWifi}
            variant="secondary"
            style={styles.actionButton}
          />
          <PiggyButton
            title="Glöm enhet"
            onPress={handleForgetDevice}
            variant="ghost"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  title: {},
  section: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actions: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});
