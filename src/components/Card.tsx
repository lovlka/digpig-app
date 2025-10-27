import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const { theme } = useTheme();

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.ivory,
            borderRadius: theme.radii.md,
            borderColor: theme.colors.line,
          },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.ivory,
          borderRadius: theme.radii.md,
          borderColor: theme.colors.line,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
