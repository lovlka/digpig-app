class WifiServiceClass {
  async scan(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      throw new Error('Wi-Fi-skanning misslyckades. Försök igen.');
    }

    return [
      'HomeNetwork_5G',
      'HomeNetwork_2.4G',
      'NeighborWiFi',
      'CafeGuest',
      'MyRouter',
    ];
  }

  async connect(ssid: string, password: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      throw new Error('Anslutning misslyckades. Kontrollera lösenordet.');
    }

    return { success: true };
  }
}

export const WifiService = new WifiServiceClass();
