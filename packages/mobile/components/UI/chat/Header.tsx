import {
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../Avatar';
import { useRouter } from 'expo-router';
import { IMAGE_2 } from '@/constants/data';
import { IUser } from '@/types';

const Header = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const handleBackPress = () => {
    if (router.canGoBack()) router.back();
    router.replace('/(tabs)/');
  };
  return (
    <BlurView intensity={90} tint="dark" style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          height: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '20%',
        }}
      >
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={20} color={Colors['dark'].icon} />
        </TouchableOpacity>
        <Avatar
          imageSource={{
            uri: user.profilePicture,
          }}
          style={styles.avatar}
          showBadge={true}
        />
      </View>
      <Text style={styles.text}>{user.fullname}</Text>
      <View
        style={{
          flexDirection: 'row',
          height: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '20%',
        }}
      >
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="call-outline" size={20} color={Colors['dark'].icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="videocam-outline" size={20} color={Colors['dark'].icon} />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    paddingTop: StatusBar.currentHeight,
    padding: 10,
    position: 'absolute',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff05',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  text: {
    color: Colors['dark'].text,
    fontSize: 18,
    fontWeight: '500',
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#ffffff0c',
    width: 45,
  },
});
