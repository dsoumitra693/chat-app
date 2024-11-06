import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{}} />
    </Stack>
  );
};

export default HomeLayout;
