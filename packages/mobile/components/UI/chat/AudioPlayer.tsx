import { FormateDurtaion } from '@/utils/time';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Waveform from '../WaveForm';
import { Colors } from '@/constants/Colors';
import { stringToSeed } from '@/utils/stringToSeed';

export const AudioPlayer = ({ url, color }: { url: string; color: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);
    await sound.playAsync();
    setIsPlaying(true);

    const { durationMillis } = await sound.getStatusAsync();
    setDuration(durationMillis);

    const interval = setInterval(async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.positionMillis < durationMillis) {
        setProgress(status.positionMillis);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setProgress(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const waveform = useMemo(() => {
    return (
      <Waveform
        height={30}
        activeColor={color}
        progress={progress / duration}
        seed={stringToSeed(url)}
      />
    );
  }, [color, progress, duration, url]);

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity
        onPress={isPlaying ? stopSound : playSound}
        style={{ ...styles.button, backgroundColor: color }}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={20}
          color={Colors['dark'].text}
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={styles.waveForm}>{waveform}</View>
      <Text
        style={{
          fontSize: 14,
          color: Colors['dark'].text2,
          left: -15,
        }}
      >
        {FormateDurtaion(duration - progress)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  audioContainer: {
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors['dark'].tint,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: Colors['dark'].text,
    fontWeight: 'bold',
  },
  waveForm: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    padding: 10,
  },
});
