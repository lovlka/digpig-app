import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { Card } from '../../components/Card';
import { PiggyButton } from '../../components/PiggyButton';
import { useStore } from '../../store';
import { generateId } from '../../utils/format';
import { MaterialIcons } from '@expo/vector-icons';

const EMOJI_OPTIONS = ['🚲', '🎮', '⚽', '🎸', '📚', '🎨', '🧸', '🎯', '🎪', '🎭', '🎬', '🎤'];

export default function NewGoalScreen() {
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const addGoal = useStore((state) => state.addGoal);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Titel saknas', 'Ange en titel för sparmålet');
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Felaktigt belopp', 'Ange ett giltigt målbelopp');
      return;
    }

    const cents = Math.round(amount * 100);

    const newGoal = {
      id: generateId(),
      deviceId,
      title: title.trim(),
      targetAmount: cents,
      currentAmount: 0,
      emoji: selectedEmoji,
      createdAt: new Date().toISOString(),
    };

    addGoal(newGoal);
    router.back();
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
            Nytt sparmål
          </Text>
        </View>

        <Card style={styles.section}>
          <Text style={[styles.label, theme.typography.bodyBold, { color: theme.colors.text }]}>
            Titel
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
            placeholder="T.ex. Ny cykel"
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.label, theme.typography.bodyBold, { color: theme.colors.text }]}>
            Målbelopp (kr)
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
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="decimal-pad"
            value={targetAmount}
            onChangeText={setTargetAmount}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.label, theme.typography.bodyBold, { color: theme.colors.text }]}>
            Välj emoji
          </Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setSelectedEmoji(emoji)}
                style={[
                  styles.emojiButton,
                  {
                    backgroundColor: selectedEmoji === emoji
                      ? theme.colors.sunnyGold
                      : theme.colors.line,
                  },
                ]}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.preview}>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Förhandsvisning:
          </Text>
          <Card style={styles.previewCard}>
            <Text style={[theme.typography.title, { color: theme.colors.text }]}>
              {selectedEmoji} {title || 'Ditt sparmål'}
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Mål: {targetAmount || '0'} kr
            </Text>
          </Card>
        </View>

        <PiggyButton
          title="Spara mål"
          onPress={handleSave}
          variant="primary"
        />
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
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 28,
  },
  preview: {
    marginTop: 8,
    marginBottom: 24,
  },
  previewCard: {
    marginTop: 8,
  },
});
