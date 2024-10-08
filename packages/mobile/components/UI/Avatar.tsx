import {
  ColorValue,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

interface IAvatarProps {
  showBadge?: boolean;
  bagdeColor?: ColorValue;
  imageSource: ImageSourcePropType | undefined;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const Avatar: React.FC<IAvatarProps> = ({
  showBadge = false,
  bagdeColor = Colors["dark"].active,
  imageSource,
  style,
}) => {
  return (
    <View style={[styles.imageWrapper, style]}>
      {showBadge && (
        <View style={{ ...styles.badge, backgroundColor: bagdeColor }} />
      )}
      <Image style={styles.avatar} source={imageSource} />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  imageWrapper: {
    width: 65,
    aspectRatio: 1,
    borderRadius: 35,
  },
  badge: {
    width: 10,
    aspectRatio: 1,
    position: "absolute",
    zIndex: 10,
    borderRadius: 100,
    bottom: '5%',
    right: '5%',
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 35,
  },
});
