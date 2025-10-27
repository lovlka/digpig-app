# DigiPiggy

DigiPiggy är en React Native-app byggd med Expo som hjälper barn att spara pengar till sina drömmar. Appen simulerar en digital spargris med BLE/Wi-Fi-anslutning för att hantera pengar och sparmål.

## Features

- **BLE-parning**: Anslut din DigiPiggy via Bluetooth (mockad)
- **Wi-Fi-setup**: Konfigurera Wi-Fi-anslutning (mockad)
- **Saldo-hantering**: Lägg till och ta bort pengar från spargrisen
- **Sparmål**: Skapa och följ upp olika sparmål med emojis
- **Flera enheter**: Hantera flera DigiPiggy-enheter samtidigt
- **Persistent data**: All data sparas lokalt med AsyncStorage

## Tech Stack

- **Expo SDK 54** - React Native framework
- **TypeScript** - Type-säker utveckling
- **React Navigation** - Native Stack + Bottom Tabs
- **Zustand** - State management
- **AsyncStorage** - Lokal persistens
- **Reanimated** - Animationer
- **Expo Haptics** - Haptisk feedback
- **Linear Gradient** - Gradient-knappar

## Fonts

- **Baloo 2** - Rubriker (h1, h2, title)
- **Nunito Sans** - Brödtext (body, bodyBold)
- **Rubik Mono One** - Display-nummer (mono)

## Installation

```bash
# Installera dependencies
npm install

# Starta utvecklingsservern
npm start
```

Sedan kan du:
- Tryck `w` för att öppna i webbläsare
- Scanna QR-koden med Expo Go på din mobil
- Tryck `i` för iOS simulator (macOS)
- Tryck `a` för Android emulator

## Miljövariabler (env)

Appen använder Expo Public Environment Variables för att konfigurera API:er m.m. Variabler som börjar med `EXPO_PUBLIC_` blir tillgängliga i appen via `process.env` och bundlas i klienten.

- Lokal utveckling: skapa en fil `.env.local` i projektroten (den ignoreras av git).
- Bygg/prod via EAS: sätt samma variabler i EAS Secrets eller i build profiles.

Exempel på `.env.local`:

```
EXPO_PUBLIC_API_URL=https://digipiggy-api.oscarevertsson.com/v1
EXPO_PUBLIC_API_KEY=din_lokala_nyckel
```

Dessa används i koden, t.ex. i `src/services/ApiService.ts`:

```
private baseUrl: string = process.env.EXPO_PUBLIC_API_URL || '';
private authToken: string = process.env.EXPO_PUBLIC_API_KEY || '';
```

Tips:
- Uppdatera `.env.local` och starta om dev-servern vid ändringar.
- Lägg aldrig privata hemligheter utan `EXPO_PUBLIC_` i klientkoden; allt som bundlas i appen är publikt.
- För hemliga nycklar på servern, använd backend eller serverless-funktioner.

## Mappstruktur

```
/src
  /components     # Återanvändbara UI-komponenter
  /screens        # Alla skärmar (onboarding, main, device)
  /navigation     # Navigation setup (stacks, tabs)
  /providers      # ThemeProvider med font loading
  /services       # BleService, WifiService (mockade)
  /store          # Zustand store med persistence
  /types          # TypeScript type definitions
  /utils          # Hjälpfunktioner (format, etc)
/assets/branding  # App-ikon och grafik
```

## UX-flöde

### Onboarding
1. **WelcomeScreen** - Välkomstskärm med "Kom igång"
2. **BluetoothPairingScreen** - Skanna och para BLE-enheter
3. **WiFiSetupScreen** - Välj/ange Wi-Fi och anslut
4. **SetupDoneScreen** - Bekräftelse, "Gå till appen"

### Main Tabs
1. **HomeScreen** - Översikt med alla grisar, totalsaldo, status
2. **GoalsScreen** - Alla sparmål med filter per enhet
3. **SettingsScreen** - App- och enhetsinställningar

### Device Flow
1. **DeviceDetailScreen** - Saldo, lägg till/ta bort pengar, mål, historik
2. **NewGoalScreen** - Skapa nytt sparmål med emoji
3. **DeviceSettingsScreen** - Byt namn, testanslutning, glöm enhet

## Mock-tjänster

### BleService
```typescript
BleService.scan()        // Returnerar 2-3 enheter efter 800ms
BleService.pair(id)      // Lyckas efter 1200ms (10% fail-rate)
```

### WifiService
```typescript
WifiService.scan()                  // Returnerar 3-5 SSID efter 600ms
WifiService.connect(ssid, pass)     // Lyckas efter 1500ms (10% fail-rate)
```

### Ersätt med riktig BLE/Wi-Fi

För att använda riktig BLE och Wi-Fi:

1. **Installera BLE-paket**:
   ```bash
   npx expo install react-native-ble-plx
   ```

2. **Ersätt BleService** i `src/services/BleService.ts`:
   ```typescript
   import { BleManager } from 'react-native-ble-plx';
   // Implementera scan/pair med BleManager
   ```

3. **Installera Wi-Fi-paket**:
   ```bash
   npx expo install react-native-wifi-reborn
   ```

4. **Ersätt WifiService** i `src/services/WifiService.ts`:
   ```typescript
   import WifiManager from 'react-native-wifi-reborn';
   // Implementera scan/connect med WifiManager
   ```

5. **Lägg till permissions** i `app.json`:
   ```json
   {
     "ios": {
       "infoPlist": {
         "NSBluetoothAlwaysUsageDescription": "För att ansluta till DigiPiggy",
         "NSLocationWhenInUseUsageDescription": "För Wi-Fi-skanning"
       }
     },
     "android": {
       "permissions": [
         "BLUETOOTH",
         "BLUETOOTH_ADMIN",
         "ACCESS_FINE_LOCATION"
       ]
     }
   }
   ```

## Acceptanstest

1. Starta appen → Welcome-skärm visas
2. Tryck "Kom igång" → Bluetooth-parning startar
3. Välj en enhet och tryck "Para" → Lyckas efter kort stund
4. Välj Wi-Fi-nätverk → Ange lösenord → Tryck "Anslut"
5. Setup Done → Tryck "Gå till appen"
6. Home-tab visar enheten med saldo 0 kr
7. Tryck på enheten → DeviceDetail öppnas
8. Tryck "+ 50 kr" → Saldo ökar, animation körs
9. Tryck på "+" vid Sparmål → Skapa mål "Cykel 150 kr 🚲"
10. Gå till Goals-tab → Mål visas med progress
11. Gå till Settings → Tryck på enheten → Byt namn
12. Tillbaka till Home → Nytt namn visas

## Tema & Design

Färger:
- **piggyPink** (#FF88AA) - Primär accent
- **sunnyGold** (#FFD75E) - Display-nummer
- **skyBlue** (#72B7F9) - Sekundär accent
- **mint** (#A8E6CF) - Success/progress
- **ivory** (#FFF9F4) - Bakgrund

Komponenter:
- **PiggyButton** - Primary/Secondary/Ghost med gradienter
- **Card** - Rundade kort med skugga
- **DisplayNumber** - Gul kapsel med mono-font
- **ProgressBar** - Animerad progress med rounded corners
- **Tag** - Små färgade labels
- **EmptyState** - Ikon + text + CTA för tomma listor

## Scripts

```bash
npm run dev           # Starta Expo dev server
npm run build:web     # Bygg för web
npm run typecheck     # TypeScript type checking
npm run lint          # Lint koden
```

## Licens

Privat projekt - Alla rättigheter förbehållna.
