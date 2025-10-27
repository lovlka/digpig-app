import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { PiggyButton } from './PiggyButton';

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={64} color={theme.colors.textMuted} />
      <Text style={[styles.title, theme.typography.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      {message && (
        <Text style={[styles.message, theme.typography.body, { color: theme.colors.textMuted }]}>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <PiggyButton
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
});
