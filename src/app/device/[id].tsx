import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import uuid from 'react-native-uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ApiService from '../../services/ApiService';
import { useTheme } from '../../providers/ThemeProvider';
import { Card } from '../../components/Card';
import { PiggyButton } from '../../components/PiggyButton';
import { DisplayNumber } from '../../components/DisplayNumber';
import { ProgressBar } from '../../components/ProgressBar';
import { useStore } from '../../store';
import { formatCurrencyShort } from '../../utils/format';
import { MaterialIcons } from '@expo/vector-icons';

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const device = useStore((state) => state.devices[id]);
  const adjustBalance = useStore((state) => state.adjustBalance);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'remove'>('add');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!device) {
    return null;
  }

  const quickAmounts = [2000, 5000, 10000];

  const handleAdjustBalance = (id: any, delta: any, selectedGoalId?: any) => {
    adjustBalance(id, delta, selectedGoalId || undefined);
    ApiService.devices.sendMessage(uuid.v4(), `You receieved ${delta / 100} kr`);
  };

  const handleQuickAdjust = (cents: number, type: 'add' | 'remove') => {
    const delta = type === 'add' ? cents : -cents;
    handleAdjustBalance(id, delta);
    animateTransaction();
  };

  const handleCustomAdjust = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Felaktigt belopp', 'Ange ett giltigt belopp');
      return;
    }

    const cents = Math.round(amount * 100);
    const delta = modalType === 'add' ? cents : -cents;
    handleAdjustBalance(id, delta, selectedGoalId || undefined);
    setShowModal(false);
    setCustomAmount('');
    setSelectedGoalId(null);
    animateTransaction();
  };

  const animateTransaction = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
  };

  const openModal = (type: 'add' | 'remove') => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.ivory }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.deviceName, theme.typography.h2, { color: theme.colors.text }]}>
            {device.name}
          </Text>
        </View>

        <Animated.View style={[styles.balanceSection, animatedStyle]}>
          <DisplayNumber value={device.balance} size="large" />
        </Animated.View>

        <View style={styles.actionsRow}>
          <View style={styles.actionColumn}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Snabbval
            </Text>
            {quickAmounts.map((amount) => (
              <PiggyButton
                key={`add-${amount}`}
                title={`+ ${formatCurrencyShort(amount)}`}
                onPress={() => handleQuickAdjust(amount, 'add')}
                variant="primary"
                style={styles.quickButton}
              />
            ))}
            <PiggyButton
              title="+ Anpassat"
              onPress={() => openModal('add')}
              variant="secondary"
              style={styles.quickButton}
            />
          </View>

          <View style={styles.actionColumn}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Ta bort
            </Text>
            {quickAmounts.map((amount) => (
              <PiggyButton
                key={`remove-${amount}`}
                title={`− ${formatCurrencyShort(amount)}`}
                onPress={() => handleQuickAdjust(amount, 'remove')}
                variant="ghost"
                style={styles.quickButton}
              />
            ))}
            <PiggyButton
              title="− Anpassat"
              onPress={() => openModal('remove')}
              variant="ghost"
              style={styles.quickButton}
            />
          </View>
        </View>

        <View style={styles.goalsSection}>
          <View style={styles.goalsSectionHeader}>
            <Text style={[theme.typography.title, { color: theme.colors.text }]}>
              Sparmål
            </Text>
            <TouchableOpacity onPress={() => router.push(`/goal/new?deviceId=${id}`)}>
              <MaterialIcons name="add-circle" size={28} color={theme.colors.piggyPink} />
            </TouchableOpacity>
          </View>

          {device.goals.length === 0 ? (
            <Card style={styles.emptyGoalsCard}>
              <Text style={[theme.typography.body, { color: theme.colors.textMuted, textAlign: 'center' }]}>
                Inga sparmål än. Skapa ditt första!
              </Text>
            </Card>
          ) : (
            device.goals.map((goal) => {
              const progress = goal.currentAmount / goal.targetAmount;
              const isComplete = goal.currentAmount >= goal.targetAmount;

              return (
                <Card key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <Text style={[theme.typography.title, { color: theme.colors.text }]}>
                      {goal.emoji} {goal.title}
                    </Text>
                    {isComplete && (
                      <MaterialIcons name="check-circle" size={24} color={theme.colors.mint} />
                    )}
                  </View>
                  <View style={styles.goalAmount}>
                    <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                      {formatCurrencyShort(goal.currentAmount)} / {formatCurrencyShort(goal.targetAmount)}
                    </Text>
                    <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                      {Math.round(progress * 100)}%
                    </Text>
                  </View>
                  <ProgressBar progress={progress} style={styles.goalProgress} />
                </Card>
              );
            })
          )}
        </View>

        <View style={styles.historySection}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            Senaste transaktioner
          </Text>
          <Card style={styles.historyCard}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted, textAlign: 'center' }]}>
              Historik kommer snart
            </Text>
          </Card>
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.ivory }]}>
            <Text style={[styles.modalTitle, theme.typography.h2, { color: theme.colors.text }]}>
              {modalType === 'add' ? 'Lägg till pengar' : 'Ta bort pengar'}
            </Text>

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
              placeholder="Ange belopp (kr)"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
              value={customAmount}
              onChangeText={setCustomAmount}
            />

            {modalType === 'add' && device.goals.length > 0 && (
              <View style={styles.goalSelectSection}>
                <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                  Välj sparmål (valfritt):
                </Text>
                {device.goals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    onPress={() => setSelectedGoalId(selectedGoalId === goal.id ? null : goal.id)}
                  >
                    <Card
                      style={StyleSheet.flatten([
                        styles.goalSelectCard,
                        selectedGoalId === goal.id && {
                          borderColor: theme.colors.skyBlue,
                          borderWidth: 2,
                        },
                      ]) as any}
                    >
                      <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                        {goal.emoji} {goal.title}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.modalButtons}>
              <PiggyButton
                title="Avbryt"
                onPress={() => {
                  setShowModal(false);
                  setCustomAmount('');
                  setSelectedGoalId(null);
                }}
                variant="ghost"
                style={styles.modalButton}
              />
              <PiggyButton
                title="Bekräfta"
                onPress={handleCustomAdjust}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  deviceName: {},
  balanceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionColumn: {
    flex: 1,
  },
  quickButton: {
    marginTop: 8,
  },
  goalsSection: {
    marginBottom: 32,
  },
  goalsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyGoalsCard: {
    padding: 24,
  },
  goalCard: {
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalProgress: {},
  historySection: {},
  historyCard: {
    marginTop: 16,
    padding: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  modalTitle: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  goalSelectSection: {
    marginBottom: 16,
  },
  goalSelectCard: {
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
  },
});
