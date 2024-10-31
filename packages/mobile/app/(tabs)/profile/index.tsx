import { ProfileDetails, ProfilePic } from '@/components/UI/profile';
import { Colors } from '@/constants/Colors';
import { IMAGE_1 } from '@/constants/data';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const SCROLL_THRESHOLD = 100;

export default function Profile() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedProfilePicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 0.15], Extrapolate.CLAMP) }],
    opacity: interpolate(scrollY.value, [0, SCROLL_THRESHOLD-20], [1, 0], Extrapolate.CLAMP),
    right: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 150], Extrapolate.CLAMP),
  }));

  const animatedProfileDetailsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 1.2], Extrapolate.CLAMP) }],
    opacity: interpolate(scrollY.value, [0, 80], [1, 0], Extrapolate.CLAMP),
  }));

  const animatedHeaderImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 0.15], Extrapolate.CLAMP) },
      { translateY: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 100], Extrapolate.CLAMP) },
    ],
    right: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 150], Extrapolate.CLAMP),
    borderRadius: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 200], Extrapolate.CLAMP),
    aspectRatio: 1,
  }));

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [50, 100], [0, 1], Extrapolate.CLAMP),
    height: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 120], Extrapolate.CLAMP),
  }));

  return (
    <>
      <StickyHeader style={animatedHeaderStyle} imageStyle={animatedHeaderImageStyle} />
      <View style={styles.container}>
        <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
          <Animated.View style={animatedProfilePicStyle}>
            <ProfilePic />
          </Animated.View>
          <Animated.View style={animatedProfileDetailsStyle}>
            <ProfileDetails />
          </Animated.View>
          <View style={{ height: 500 }} />
        </Animated.ScrollView>
      </View>
    </>
  );
}

const StickyHeader = ({
  style,
  imageStyle,
}: {
  style: any;
  imageStyle: any;
}) => (
  <Animated.View style={[style, styles.stickyHeader]}>
    <Animated.View style={[styles.imageWrapper, imageStyle]}>
      <Image source={{ uri: IMAGE_1 }} style={styles.image} />
    </Animated.View>
    <View style={styles.profileInfoContainer}>
      <Text style={styles.profileName}>Soumo Das</Text>
      <Text style={styles.profilePhone}>+917478XXXXX8</Text>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors['dark'].background,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    paddingTop: 20,
    width: '100%',
    zIndex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors['dark'].secondary,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    alignItems: 'flex-start',
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  profileInfoContainer: {
    position: 'relative',
    left: 15,
    padding: 10,
    borderRadius: 8,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePhone: {
    color: '#fff',
    fontSize: 14,
  },
});
