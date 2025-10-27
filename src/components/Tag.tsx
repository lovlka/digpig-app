import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface TagProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

export const Tag: React.FC<TagProps> = ({ label, color, style }) => {
  const { theme } = useTheme();
  const bgColor = color || theme.colors.mint;

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: bgColor,
          borderRadius: theme.radii.pill,
        },
        style,
      ]}
    >
      <Text style={[styles.text, theme.typography.body, { color: theme.colors.text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
  },
});
