import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, DeviceId, Goal } from '../types';

interface AppState {
  devices: Record<DeviceId, Device>;
  isHydrated: boolean;
  deviceCount: number;
  addDevice: (device: Device) => void;
  updateDevice: (deviceId: DeviceId, updates: Partial<Device>) => void;
  removeDevice: (deviceId: DeviceId) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  adjustBalance: (deviceId: DeviceId, deltaCents: number, goalId?: string) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const STORAGE_KEY = '@digipiggy:store';

export const useStore = create<AppState>((set, get) => ({
  devices: {},
  isHydrated: false,
  deviceCount: 0,

  addDevice: (device) => {
    set((state) => ({
      devices: { ...state.devices, [device.id]: device },
      deviceCount: Object.keys(state.devices).length + 1,
    }));
    get().persist();
  },

  updateDevice: (deviceId, updates) => {
    set((state) => {
      const device = state.devices[deviceId];
      if (!device) return state;
      return {
        devices: {
          ...state.devices,
          [deviceId]: { ...device, ...updates },
        },
      };
    });
    get().persist();
  },

  removeDevice: (deviceId) => {
    set((state) => {
      const { [deviceId]: removed, ...rest } = state.devices;
      return { devices: rest, deviceCount: Object.keys(rest).length };
    });
    get().persist();
  },

  addGoal: (goal) => {
    set((state) => {
      const device = state.devices[goal.deviceId];
      if (!device) return state;
      return {
        devices: {
          ...state.devices,
          [goal.deviceId]: {
            ...device,
            goals: [...device.goals, goal],
          },
        },
      };
    });
    get().persist();
  },

  updateGoal: (goalId, updates) => {
    set((state) => {
      const newDevices = { ...state.devices };
      for (const deviceId in newDevices) {
        const device = newDevices[deviceId];
        const goalIndex = device.goals.findIndex((g) => g.id === goalId);
        if (goalIndex !== -1) {
          const updatedGoals = [...device.goals];
          updatedGoals[goalIndex] = { ...updatedGoals[goalIndex], ...updates };
          newDevices[deviceId] = { ...device, goals: updatedGoals };
          break;
        }
      }
      return { devices: newDevices };
    });
    get().persist();
  },

  adjustBalance: (deviceId, deltaCents, goalId) => {
    set((state) => {
      const device = state.devices[deviceId];
      if (!device) return state;

      const newBalance = device.balance + deltaCents;
      let updatedGoals = device.goals;

      if (goalId) {
        updatedGoals = device.goals.map((goal) => {
          if (goal.id === goalId) {
            return {
              ...goal,
              currentAmount: Math.max(0, Math.min(goal.targetAmount, goal.currentAmount + deltaCents)),
            };
          }
          return goal;
        });
      }

      return {
        devices: {
          ...state.devices,
          [deviceId]: {
            ...device,
            balance: Math.max(0, newBalance),
            goals: updatedGoals,
          },
        },
      };
    });
    get().persist();
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const devices = data.devices || {};
        set({
          devices,
          deviceCount: Object.keys(devices).length,
          isHydrated: true
        });
      } else {
        set({ isHydrated: true, deviceCount: 0 });
      }
    } catch (error) {
      console.error('Failed to hydrate store:', error);
      set({ isHydrated: true, deviceCount: 0 });
    }
  },

  persist: async () => {
    try {
      const { devices } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ devices }));
    } catch (error) {
      console.error('Failed to persist store:', error);
    }
  },
}));
