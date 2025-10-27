import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../providers/ThemeProvider';

interface ProgressBarProps {
  progress: number;
  style?: ViewStyle;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  style,
  color,
}) => {
  const { theme } = useTheme();
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withSpring(Math.min(Math.max(progress, 0), 1), {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const barColor = color || theme.colors.piggyPink;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.overlay,
          borderRadius: theme.radii.pill,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: barColor,
            borderRadius: theme.radii.pill,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
