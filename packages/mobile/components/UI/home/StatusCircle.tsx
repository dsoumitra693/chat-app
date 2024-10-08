import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { IMAGE_2 } from "@/constants/data";

const WIDTH = 70;
const INNER_WIDTH = WIDTH - 5;

const StatusCircle = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={["#CA1D7E", "#E35157", "#F2703F"]}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
    >
      <View style={styles.imageContainer}>
        <Image source={{uri:IMAGE_2}}
        style={styles.image}
        resizeMode="cover"
        />
      </View>
    </LinearGradient>
  );
};

export default StatusCircle;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    aspectRatio: 1,
    margin: 5,
    borderRadius: WIDTH / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: INNER_WIDTH,
    aspectRatio: 1,
    borderRadius: INNER_WIDTH / 2,
    borderWidth: 3,
    overflow:"hidden"
  },
  image:{
    width:"100%",
    aspectRatio:1,
  }
});
