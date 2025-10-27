import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeProvider';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { ProgressBar } from '../../components/ProgressBar';
import { Tag } from '../../components/Tag';
import { useStore } from '../../store';
import { formatCurrencyShort } from '../../utils/format';
import { MaterialIcons } from '@expo/vector-icons';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const deviceStore = useStore((state) => state.devices);
  const devices = Object.values(deviceStore);
  const [filterDeviceId, setFilterDeviceId] = useState<string | null>(null);

  const allGoals = devices.flatMap((device) =>
    device.goals.map((goal) => ({
      ...goal,
      deviceName: device.name,
    }))
  );

  const filteredGoals = filterDeviceId
    ? allGoals.filter((g) => g.deviceId === filterDeviceId)
    : allGoals;

  if (allGoals.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
        <EmptyState
          icon="flag"
          title="Inga sparmål än"
          message="Skapa ditt första sparmål för att börja spara"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          Sparmål
        </Text>
        <View style={styles.filterRow}>
          <TouchableOpacity onPress={() => setFilterDeviceId(null)}>
            <Tag
              label="Alla"
              color={!filterDeviceId ? theme.colors.piggyPink : theme.colors.line}
            />
          </TouchableOpacity>
          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              onPress={() => setFilterDeviceId(device.id)}
            >
              <Tag
                label={device.name}
                color={filterDeviceId === device.id ? theme.colors.skyBlue : theme.colors.line}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress = item.currentAmount / item.targetAmount;
          const isComplete = item.currentAmount >= item.targetAmount;

          return (
            <Card style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={[styles.goalTitle, theme.typography.title, { color: theme.colors.text }]}>
                  {item.emoji} {item.title}
                </Text>
                {isComplete && (
                  <MaterialIcons name="check-circle" size={24} color={theme.colors.mint} />
                )}
              </View>
              <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                {item.deviceName}
              </Text>
              <View style={styles.amountRow}>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  {formatCurrencyShort(item.currentAmount)} / {formatCurrencyShort(item.targetAmount)}
                </Text>
                <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <ProgressBar progress={progress} style={styles.progress} />
            </Card>
          );
        }}
        contentContainerStyle={styles.list}
      />
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
  title: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    padding: 24,
    paddingTop: 8,
  },
  goalCard: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalTitle: {},
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  progress: {},
});
