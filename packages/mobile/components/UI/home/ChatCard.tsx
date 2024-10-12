import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Avatar from '../Avatar';
import { IMAGE_2 } from '@/constants/data';

const ChatCard = ({ unread, online }: { unread: boolean; online: boolean }) => {
  const router = useRouter();

  const handleOnPress = () => {
    router.push('/(tabs)/chat');
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleOnPress}>
      <Avatar
        showBadge={online}
        imageSource={{
          uri: IMAGE_2,
        }}
      />
      <View style={styles.msgDetailsWrapper}>
        <Text style={styles.heading}>Disha</Text>
        <Text style={styles.secondary}>Hello world!</Text>
      </View>
      <View style={styles.timestampWrapper}>
        {unread ? (
          <Text style={styles.msgCount}>2</Text>
        ) : (
          <Ionicons
            name="checkmark-done"
            size={20}
            color={Colors['dark'].icon}
          />
        )}
        <Text style={styles.time}>10:57</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  msgDetailsWrapper: {
    justifyContent: 'center',
    flexBasis: 210,
  },
  heading: {
    fontSize: 16,
    color: Colors['dark'].text,
  },
  secondary: {
    color: Colors['dark'].text2,
  },
  timestampWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgCount: {
    backgroundColor: Colors['dark'].danger,
    width: 25,
    textAlign: 'center',
    verticalAlign: 'middle',
    aspectRatio: 1,
    borderRadius: 20,
    color: Colors['dark'].text,
    fontSize: 14,
    fontWeight: '800',
  },
  time: {
    color: Colors['dark'].text,
    fontSize: 12,
    fontWeight: '400',
  },
});
