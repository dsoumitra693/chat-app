import { ProfileDetails, ProfilePic } from "@/components/UI/profile";
import { Colors } from "@/constants/Colors";
import { View, StyleSheet, Text } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <ProfilePic/>
      <ProfileDetails />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors['dark'].background
  }
});
