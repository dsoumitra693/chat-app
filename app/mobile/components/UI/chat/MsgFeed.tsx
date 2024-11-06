import React from 'react';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Message from './Message';
import { MESSAGES } from '@/constants/data';
import TypingRipple from './TypingRipple';
import { IMessage } from '@/types';

const MsgFeed = () => {
  return (
    <FlashList<IMessage>
      data={MESSAGES.slice().reverse()}
      renderItem={({ item }) => <Message message={item} />}
      keyExtractor={(item) => item.id.toString()}
      inverted
      estimatedItemSize={50}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={<TypingRipple name="Emma" />}
    />
  );
};

export default MsgFeed;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    paddingBottom: 90,
  },
});
