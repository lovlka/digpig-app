import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { formatCurrency } from '../utils/format';

interface DisplayNumberProps {
  value: number;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export const DisplayNumber: React.FC<DisplayNumberProps> = ({
  value,
  style,
  size = 'medium',
}) => {
  const { theme } = useTheme();

  const fontSize = size === 'large' ? 32 : size === 'medium' ? 24 : 18;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.sunnyGold,
          borderRadius: theme.radii.pill,
        },
        style,
      ]}
    >
      <Text
        style={[
          theme.typography.mono,
          { color: theme.colors.text, fontSize },
        ]}
      >
        {formatCurrency(value)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
});
