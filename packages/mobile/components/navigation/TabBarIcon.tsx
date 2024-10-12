import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import React from 'react';
import { type ComponentProps } from 'react';
import { View } from 'react-native';

interface TabBarIconProps
  extends IconProps<ComponentProps<typeof Ionicons>['name']> {
  focused: boolean;
  color: string;
}

export function TabBarIcon({
  focused,
  color,
  style,
  ...rest
}: TabBarIconProps) {
  return (
    <>
      <Ionicons
        size={28}
        color={color}
        style={[{ marginBottom: -15 }, style]}
        {...rest}
      />
      {focused && (
        <View
          style={{
            width: 60,
            backgroundColor: color,
            height: 3,
            position: 'absolute',
            bottom: -12,
            borderRadius: 6,
          }}
        />
      )}
    </>
  );
}
