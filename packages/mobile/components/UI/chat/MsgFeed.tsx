import React from "react";
import { StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Message from "./Message";
import { MESSAGES } from "@/constants/data";
import TypingRipple from "./TypingRipple";

const MsgFeed = () => {
  return (
    <FlashList
      data={MESSAGES.toReversed()}
      renderItem={({ item }) => <Message message={item} />}
      keyExtractor={(item) => item.id.toString()}
      inverted
      estimatedItemSize={50}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={<TypingRipple name="Puchu🦋"/>}
    />
  );
};

export default MsgFeed;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    padding:10,
    paddingBottom: 90,
  },
});
