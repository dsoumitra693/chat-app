import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Icon } from '@expo/vector-icons/build/createIconSet';

const TextIcon = ({
  Icon,
  style,
  color,
  text,
  name,
  size,
  onPress,
}: {
  Icon: Icon<any, any>;
  style?: StyleProp<ViewStyle>;
  color: string;
  text?: string;
  name: string;
  size?: number;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  return (
    <TouchableOpacity style={[styles.iconWrapper, style]} onPress={onPress}>
      <Icon name={name} size={size || 25} color={color} />
      {!!text && <Text style={styles.text}>{text}</Text>}
    </TouchableOpacity>
  );
};

export default TextIcon;

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 10,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 15,
    marginHorizontal: 10,
  },
  text: {
    color: Colors.dark.text,
  },
});
