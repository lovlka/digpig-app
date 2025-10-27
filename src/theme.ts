export const theme = {
  colors: {
    piggyPink: "#FF88AA",
    sunnyGold: "#FFD75E",
    skyBlue: "#72B7F9",
    mint: "#A8E6CF",
    ivory: "#FFF9F4",
    text: "#222222",
    textMuted: "#5F6B7A",
    line: "#E9E6E1",
    overlay: "rgba(0,0,0,0.05)",
  },
  radii: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    h1: {
      fontFamily: 'Baloo2_700Bold',
      fontSize: 32,
      lineHeight: 40,
    },
    h2: {
      fontFamily: 'Baloo2_600SemiBold',
      fontSize: 24,
      lineHeight: 28,
    },
    title: {
      fontFamily: 'Baloo2_600SemiBold',
      fontSize: 20,
      lineHeight: 24,
    },
    body: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 22,
    },
    bodyBold: {
      fontFamily: 'NunitoSans_700Bold',
      fontSize: 16,
      lineHeight: 22,
    },
    mono: {
      fontFamily: 'RubikMonoOne_400Regular',
      fontSize: 16,
      lineHeight: 18,
    },
  },
};

export type Theme = typeof theme;
