import { Redirect, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/provides';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useSession();

  if (!session) return <Redirect href="/signin" />;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].secondary,
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].secondary,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="calls"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              name={focused ? 'call' : 'call-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle: {
            // display: "none",
          },
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <>
              <TabBarIcon
                name={focused ? 'chatbox' : 'chatbox-outline'}
                color={color}
                focused={focused}
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              name={focused ? 'person' : 'person-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
