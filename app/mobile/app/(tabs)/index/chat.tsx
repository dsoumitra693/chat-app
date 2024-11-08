import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Header, MessageArea, MsgFeed } from '@/components/UI/chat';
import { SENDER, WALLPAPER_URI } from '@/constants/data';

const chat = () => {
  return (
    <View style={styles.container}>
      <Header user={SENDER} />
      <MsgFeed />
      <MessageArea />
      <Image
        style={styles.wallpaper}
        source={{
          uri: WALLPAPER_URI,
        }}
      />
    </View>
  );
};

export default chat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors['dark'].background,
    flex: 1,
  },
  wallpaper: {
    width: '100%',
    height: '100%',
    zIndex: -100,
    position: 'absolute',
  },
});