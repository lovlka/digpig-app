import { StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function PiggyScreen() {
  const callApiEndpoint = () => {
    // This will call the API endpoint when it's known
    console.log('API endpoint will be called here');
    // TODO: Replace with actual API call when endpoint is known
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFD700', dark: '#8B7500' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#A0522D"
          name="dollarsign.circle.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Piggy</ThemedText>
      </ThemedView>
      <ThemedText>Welcome to the Piggy tab! This is where you can interact with the Piggy API.</ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={callApiEndpoint}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>Call API Endpoint</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    right: 20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
