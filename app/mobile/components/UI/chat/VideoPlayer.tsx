import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useVideoPlayer, VideoView, VideoPlayer as VP } from 'expo-video';

export const VideoPlayer = ({ url }: { url: string }) => {
  const [isPlaying, setisPlaying] = useState(false);
  const [player, setPlayer] = useState<VP>();
  const [showNativeControl, setShowNativeControl] = useState(false);
  const videoRef = useRef<VideoView>(null);
  const toogleFullScreen = () => {
    console.log(videoRef.current);
    videoRef.current?.enterFullscreen();
    player?.play();
    console.log(videoRef.current);
  };

  const currentPlayer = useVideoPlayer(url, (player) => {
    player.loop = true;
    setPlayer(player);
  });

  const tooglePlayPause = () => {
    if (isPlaying) {
      player?.pause();
    } else {
      player?.play();
    }
    setisPlaying((prev) => !prev);
  };

  useEffect(() => {
    setisPlaying(!!player?.playing);
  }, [player?.playing]);

  const handleFullscreenEnter = () => {
    console.log('hello');
    setShowNativeControl(true);
  };
  const handleFullscreenExit = () => {
    setShowNativeControl(false);
  };
  return (
    <View style={styles.videoWrapper}>
      <VideoView
        player={currentPlayer}
        style={styles.video}
        nativeControls={showNativeControl}
        contentFit="cover"
        ref={videoRef}
        onFullscreenEnter={handleFullscreenEnter}
        onFullscreenExit={handleFullscreenExit}
      />
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={toogleFullScreen}
      />
      <Ionicons
        name={isPlaying ? 'pause' : 'play'}
        size={40}
        color={Colors['dark'].text}
        style={styles.icon}
        onPress={tooglePlayPause}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: 300,
    height: 300,
    marginBottom: 5,
    borderRadius: 15,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  touchableArea: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
