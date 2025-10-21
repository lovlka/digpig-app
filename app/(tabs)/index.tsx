import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, Platform, ToastAndroid } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAmount = async () => {
    const value = amount.trim();
    if (!value) {
      Alert.alert('Missing amount', 'Please enter an amount before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://digpig.local:8080/display', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: value }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`Request failed: ${res.status} ${res.statusText}${msg ? ` - ${msg}` : ''}`);
      }

      Alert.alert('Success', 'Amount submitted to Piggy.');
      setAmount('');
      setError(null);
    } catch (e: any) {
      console.error('Submit error', e);
      const message = e?.message ?? 'Failed to submit amount';
      // Show toast on Android; alert on iOS; inline banner on Web so it's visible in browser.
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else if (Platform.OS === 'ios') {
        Alert.alert('Error', message);
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFF9F4', dark: '#FFF9F4' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#FF88AA"
          name="dollarsign.circle.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.centeredText} type="title">DigiPiggy</ThemedText>
      </ThemedView>
      <ThemedText style={styles.centeredText}>Enter an amount and submit it to the API.</ThemedText>

      {!!error && (
        <ThemedView pointerEvents="box-none" style={styles.errorOverlayContainer}>
          <ThemedView style={styles.errorOverlay}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.errorClose} onPress={() => setError(null)}>
              <ThemedText style={styles.errorCloseText}>Dismiss</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.formContainer}>
        <TextInput
          value={amount}
          onChangeText={(t) => { setAmount(t); if (error) setError(null); }}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          inputMode="decimal"
          style={styles.input}
          editable={!submitting}
          returnKeyType="send"
          onSubmitEditing={submitAmount}
        />

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={submitAmount}
          activeOpacity={0.7}
          disabled={submitting}
        >
          <ThemedText style={styles.buttonText}>{submitting ? 'Submitting…' : 'Submit'}</ThemedText>
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
  centeredText: {
    textAlign: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  formContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    gap: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF88AA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  errorOverlayContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
    zIndex: 9999,
  },
  errorOverlay: {
    maxWidth: 600,
    width: '90%',
    backgroundColor: '#fdecea',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  errorText: {
    color: '#a94442',
    fontSize: 14,
  },
  errorClose: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f5c6cb',
    borderRadius: 6,
  },
  errorCloseText: {
    color: '#7a1f1f',
    fontWeight: '600',
  },
});
