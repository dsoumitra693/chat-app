import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ChatCard } from './';

const CHATS = [{}, {}, {}, {}, {}, {}];

const ChatFeed = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        <Ionicons name="play-sharp" />
        {'  '}PIN CHATS
      </Text>
      <ChatCard unread={true} online={true} />
      <View style={{ height: 15 }} />
      <Text style={styles.heading}>ALL MESSAGES</Text>
      {CHATS.map((chat, index) => (
        <ChatCard key={index} unread={false} online={!!(Math.random() > 0.8)} />
      ))}
      <View style={{ height: 50 }} />
    </View>
  );
};

export default ChatFeed;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors['dark'].background,
    padding: 20,
  },
  heading: {
    color: Colors['dark'].text,
    verticalAlign: 'middle',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  },
});
