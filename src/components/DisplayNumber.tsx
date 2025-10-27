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
          paddingHorizontal: fontSize,
          paddingVertical: fontSize * 0.2,
        },
        style,
      ]}
    >
      <Text
        style={[
          theme.typography.bodyBold,
          { color: theme.colors.text, fontSize, lineHeight: fontSize * 1.5 },
        ]}
      >
        {formatCurrency(value)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start'
  }
});
