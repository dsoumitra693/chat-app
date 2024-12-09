import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';

const CallVideo = ({
  video,
  placeholder,
}: {
  video: string;
  placeholder: string;
}) => {
  const player = useVideoPlayer(video);
  return (
    <View style={styles.container}>
      {!video ? (
        <Image
          source={{ uri: placeholder }}
          style={styles.placeholder}
          resizeMode="cover"
        />
      ) : (
        <VideoView player={player} style={styles.video} contentFit="cover" />
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
