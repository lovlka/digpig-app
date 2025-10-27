import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { Card } from '../../components/Card';
import { DisplayNumber } from '../../components/DisplayNumber';
import { EmptyState } from '../../components/EmptyState';
import { StatusIndicator } from '../../components/StatusIndicator';
import { ProgressBar } from '../../components/ProgressBar';
import { useStore } from '../../store';
import { formatCurrencyShort } from '../../utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const deviceStore = useStore((state) => state.devices);
  const devices = Object.values(deviceStore);

  const totalBalance = devices.reduce((sum, device) => sum + device.balance, 0);

  if (devices.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
        <EmptyState
          icon="savings"
          title="Ingen spargris än"
          message="Lägg till din första DigiPiggy för att komma igång"
          actionLabel="Lägg till gris"
          onAction={() => router.push('/onboarding/welcome')}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.colors.text }]}>
          Mina grisar
        </Text>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const nextGoal = item.goals.find((g) => g.currentAmount < g.targetAmount);
          const progress = nextGoal
            ? nextGoal.currentAmount / nextGoal.targetAmount
            : 0;

          return (
            <Card
              onPress={() => router.push(`/device/${item.id}`)}
              style={styles.deviceCard}
            >
              <View style={styles.deviceHeader}>
                <Text style={[styles.deviceName, theme.typography.title, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <View style={styles.statusRow}>
                  <StatusIndicator type="wifi" status={item.wifiStatus} />
                  <StatusIndicator type="bluetooth" status={item.bleStatus} />
                </View>
              </View>

              <DisplayNumber value={item.balance} size="small" style={styles.balance} />

              {nextGoal && (
                <View style={styles.goalSection}>
                  <View style={styles.goalHeader}>
                    <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                      {nextGoal.emoji} {nextGoal.title}
                    </Text>
                    <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                      {formatCurrencyShort(nextGoal.currentAmount)} / {formatCurrencyShort(nextGoal.targetAmount)}
                    </Text>
                  </View>
                  <ProgressBar progress={progress} style={styles.progress} />
                </View>
              )}
            </Card>
          );
        }}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.piggyPink }]}
        onPress={() => router.push('/onboarding/welcome')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    marginBottom: 16,
  },
  list: {
    padding: 24,
    paddingTop: 8,
  },
  deviceCard: {
    marginBottom: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {},
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  balance: {
    marginBottom: 12,
  },
  goalSection: {
    marginTop: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progress: {},
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
