import { useFonts } from 'expo-font';

export const COLOR = {
  baseGreen: "#02feb4",
  basePink: "#ef91fe",
  baseWhite: "#fffefe",
  baseBlack: "#111111",
  boderWhite: 'rgba(255,255,255,0.6)'
};

// Rest of the import statements

export const LoadFont = () => {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.otf'),
  });

  return fontsLoaded
}
