import { Stack, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

const IndexLayout = () => {
  const [currentRoute, setCurrentRoute] = useState('index');
  const navigation = useNavigation();
  useEffect(() => {
    if (currentRoute === 'index') {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    }
  }, [currentRoute]);

  return (
    <Stack
      initialRouteName="index"
      screenOptions={({ route }) => {
        setCurrentRoute(route.name);
        return {
          headerShown: false,
        };
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="call" />
    </Stack>
  );
};

export default IndexLayout;
