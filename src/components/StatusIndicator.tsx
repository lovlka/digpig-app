import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';

interface StatusIndicatorProps {
  type: 'wifi' | 'bluetooth';
  status: 'disconnected' | 'connecting' | 'connected' | 'scanning' | 'pairing' | 'paired';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ type, status }) => {
  const { theme } = useTheme();

  const getIcon = () => {
    return type === 'wifi' ? 'wifi' : 'bluetooth';
  };

  const getColor = () => {
    if (status === 'connected' || status === 'paired') {
      return theme.colors.mint;
    }
    if (status === 'connecting' || status === 'pairing' || status === 'scanning') {
      return theme.colors.sunnyGold;
    }
    return theme.colors.textMuted;
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name={getIcon()} size={16} color={getColor()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
