import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ResizeMode, Video } from 'expo-av';

const CallVideo = ({
  video,
  placeholder,
}: {
  video: string;
  placeholder: string;
}) => {
  return (
    <View style={styles.container}>
      {!video ? (
        <Image
          source={{ uri: placeholder }}
          style={styles.placeholder}
          resizeMode="cover"
        />
      ) : (
        <Video
          source={{ uri: video }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
        />
      )}
    </View>
  );
};

export default CallVideo;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
