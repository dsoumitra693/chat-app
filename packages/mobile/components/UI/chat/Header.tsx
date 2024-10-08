import { StyleSheet, Text, StatusBar, TouchableOpacity } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../Avatar";
import { useRouter } from "expo-router";
import { IMAGE_2 } from "@/constants/data";
import { IUser } from "@/types";

const Header = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const handleBackPress = () => {
    if (router.canGoBack()) router.back();
    router.replace("/(tabs)/");
  };
  return (
    <BlurView intensity={90} tint="dark" style={styles.container}>
      <TouchableOpacity onPress={handleBackPress}>
        <Ionicons name="chevron-back" size={20} color={Colors["dark"].icon} />
      </TouchableOpacity>
      <Text style={styles.text}>{user.name}</Text>
      <Avatar
        imageSource={{
          uri: user.displayPicture,
        }}
        style={styles.avatar}
        showBadge={true}
      />
    </BlurView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    paddingTop: StatusBar.currentHeight,
    padding: 20,
    paddingVertical: 10,
    position: "absolute",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff05",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  text: {
    color: Colors["dark"].text,
    fontSize: 18,
    fontWeight: "500",
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#ffffff0c",
    width: 45,
  },
});
