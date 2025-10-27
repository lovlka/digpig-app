export type DeviceId = string;

export interface Device {
  id: DeviceId;
  name: string;
  balance: number;
  wifiStatus: "disconnected" | "connecting" | "connected";
  bleStatus: "disconnected" | "scanning" | "pairing" | "paired";
  goals: Goal[];
  createdAt: string;
}

export interface Goal {
  id: string;
  deviceId: DeviceId;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji?: string;
  createdAt: string;
}

export interface BleDevice {
  id: string;
  name: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
