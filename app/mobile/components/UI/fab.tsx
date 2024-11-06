import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@expo/vector-icons/build/createIconSet';

const FAB = ({
  onPress,
  name,
  size,
  color,
  Icon,
}: {
  onPress?: (e: GestureResponderEvent) => void;
  name: string;
  color: string;
  size?: number;
  Icon: Icon<any, any>;
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default FAB;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    aspectRatio: 1,
    borderRadius: 30,
    top: '85%',
    right: 20,
    backgroundColor: Colors['dark'].tabIconSelected,
  },
});
