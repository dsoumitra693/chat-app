import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IMAGE_1, IMAGE_2 } from '@/constants/data';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import CallVideo from '@/components/UI/call/CallVideo';
import MuteText from '@/components/UI/call/MuteText';
import TextIcon from '@/components/UI/call/TextIcon';

const myVideo = IMAGE_1;
const callerVideo = IMAGE_2;

const Call = () => {
  const [isShowingMyVideo, setIsShowingMyVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  return (
    <View style={styles.container}>
      <CallVideo
        video={isShowingMyVideo ? (showVideo ? myVideo : '') : callerVideo}
        placeholder={isShowingMyVideo ? IMAGE_1 : IMAGE_2}
      />
      {!audioOn && <MuteText />}
      <TouchableOpacity
        style={styles.myVideo}
        onPress={() => setIsShowingMyVideo((prev) => !prev)}
      >
        <CallVideo
          video={isShowingMyVideo ? callerVideo : showVideo ? myVideo : ''}
          placeholder={isShowingMyVideo ? IMAGE_2 : IMAGE_1}
        />
      </TouchableOpacity>
      <View style={styles.bottomBar}>
        <TextIcon
          Icon={Ionicons}
          name={showVideo ? 'videocam-outline' : 'videocam-off-outline'}
          color={Colors.dark.icon as string}
        />
        <TextIcon
          Icon={Ionicons}
          name={audioOn ? 'mic-outline' : 'mic-off-outline'}
          color={Colors.dark.icon as string}
        />
        <TextIcon
          Icon={MaterialCommunityIcons}
          name="camera-flip-outline"
          color={Colors.dark.icon as string}
        />
        <TextIcon
          Icon={MaterialIcons}
          name="call-end"
          color={Colors.dark.text as string}
          style={styles.endCallButton}
          text={'10:00'}
        />
      </View>
    </View>
  );
};

export default Call;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  myVideo: {
    width: 100,
    aspectRatio: 3 / 5,
    right: 20,
    top: 40,
    position: 'absolute',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors['dark'].secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 50,
  },
  bottomBar: {
    backgroundColor: Colors.dark.secondary,
    bottom: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  iconWrapper: {},
  endCallButton: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: `${Colors.dark.danger}dd`,
  },
  endCallText: {
    color: Colors.dark.text,
  },
});
