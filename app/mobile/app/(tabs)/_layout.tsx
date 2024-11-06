import { Redirect, Tabs, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/provides';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session, user } = useSession();
  const pathname = usePathname();

  // if (!session) return <Redirect href="/signin" />;
  // if (!user) return <Redirect href="/createProfile" />;

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
        name="calls-history"
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
            // display: pathname != '/' ? 'none' : 'flex',
            display:'none'
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
