import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, VideoFullscreenUpdateEvent } from 'expo-av';
import { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const FULLSCREEN_ENTER = 1;
const FULLSCREEN_EXIT = 3;

export const VideoPlayer = ({ url }: { url: string }) => {
  const [isPlaying, setisPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<Video>(null);
  const handleFullScreen = () => {
    videoRef.current?.presentFullscreenPlayer();
    setIsFullScreen(true);
  };

  const handleFullscreenUpdate = (event: any) => {
    if (event.fullscreenUpdate === FULLSCREEN_ENTER) {
      setIsFullScreen(true);
    }
    if (event.fullscreenUpdate === FULLSCREEN_EXIT) {
      setIsFullScreen(false);
    }
  };
  return (
    <TouchableOpacity style={styles.videoWrapper} onPress={handleFullScreen}>
      <Video
        source={{ uri: url }}
        rate={1.0}
        isLooping
        volume={1.0}
        isMuted={false}
        shouldPlay={isPlaying}
        useNativeControls={false}
        style={styles.video}
        ref={videoRef}
        resizeMode={isFullScreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
        onFullscreenUpdate={handleFullscreenUpdate}
      />
      <Ionicons
        name={isPlaying ? 'pause' : 'play'}
        size={40}
        color={Colors['dark'].text}
        style={styles.icon}
        onPress={() => {
          setisPlaying((prev) => !prev);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
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
});
