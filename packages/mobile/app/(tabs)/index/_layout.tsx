import { useIsFocused } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import { useEffect } from 'react';

const IndexLayout = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const currentRoute =
        navigation.getState()?.routes?.[navigation.getState().index]?.name;

      if (currentRoute === 'chat') {
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'none' },
        });
      } else {
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'flex' },
        });
      }
    }
  }, [isFocused, navigation]);
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="call" />
    </Stack>
  );
};

export default IndexLayout;
