import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../providers/ThemeProvider';
import { ButtonVariant } from '../types';

interface PiggyButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const PiggyButton: React.FC<PiggyButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const { theme } = useTheme();

  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'primary':
        return [theme.colors.piggyPink, theme.colors.sunnyGold];
      case 'secondary':
        return [theme.colors.skyBlue, theme.colors.mint];
      default:
        return [theme.colors.ivory, theme.colors.ivory];
    }
  };

  const textColor = variant === 'ghost' ? theme.colors.text : '#FFFFFF';

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.ghostButton,
          { borderColor: theme.colors.line },
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.text} />
        ) : (
          <Text style={[styles.text, { color: textColor }, theme.typography.bodyBold]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.touchable, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.text, { color: textColor }, theme.typography.bodyBold]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 48,
  },
  gradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: 48,
  },
  ghostButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
