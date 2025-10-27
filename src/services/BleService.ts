import { BleDevice } from '../types';

class BleServiceClass {
  async scan(): Promise<BleDevice[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      throw new Error('Bluetooth-skanning misslyckades. Försök igen.');
    }

    return [
      { id: 'device_1234', name: 'DigiPiggy_1234' },
      { id: 'device_lisa', name: 'DigiPiggy_Lisa' },
      { id: 'device_5678', name: 'DigiPiggy_5678' },
    ];
  }

  async pair(id: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      throw new Error('Ihopparning misslyckades. Försök igen.');
    }

    return { success: true };
  }
}

export const BleService = new BleServiceClass();
