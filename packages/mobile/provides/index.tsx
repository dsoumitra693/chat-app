import React from 'react';
import SessionProvider from './SessionProvider';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';

interface ProviderProps {
  children: React.ReactNode;
}

export const RootProvider: React.FC<ProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export { useSession } from './SessionProvider';
