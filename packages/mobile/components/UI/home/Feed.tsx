import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Heading from "./Heading";
import Searchbar from "./Searchbar";
import ChatFeed from "./ChatFeed";

const Feed = () => {
  return (
    <View style={styles.container}>
      <Heading />
      <Searchbar />
      <ChatFeed/>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
