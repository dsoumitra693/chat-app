import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import Avatar from '../Avatar';
import { IMessage } from '@/types';
import { FormateTime } from '@/utils/time';
import DisplayFile from './DisplayFile';
import { LongPressGestureHandler } from 'react-native-gesture-handler';

interface IMessageProps {
  message: IMessage;
}

const Message: React.FC<IMessageProps> = ({ message }) => {
  const [showEmojis, setshowEmojis] = useState(false);

  const handleLongPress = () => {
    setshowEmojis(true);
  };
  const handleReaction = (emoji: string) => {
    setshowEmojis(false);
  };
  return (
    <View style={{ ...styles.container, ...(message.self && styles.right) }}>
      <View
        style={{
          ...styles.avatarWrapper,
          ...(message.self && styles.avatarWrapperRight),
        }}
      >
        <Avatar
          imageSource={{ uri: message.sender.profilePicture }}
          style={styles.avatar}
        />
        <Text style={styles.textSecondary}>
          {FormateTime(message.timeStamp)}
        </Text>
      </View>
      <LongPressGestureHandler onActivated={handleLongPress}>
        <View
          style={{
            ...styles.msgWrapper,
            ...(message.self && styles.msgWrapperRight),
          }}
        >
          <DisplayFile
            type={message.fileType}
            url={message.file}
            self={message.self}
          />
          {message.text && <Text style={styles.text}>{message.text}</Text>}
        </View>
      </LongPressGestureHandler>
      <View style={styles.reactionWrapper}>
        {message.reactions &&
          Array.from(message.reactions.keys()).map((key) => (
            <View
              key={key}
              style={{
                ...styles.reactionContainer,
                ...(message.self && styles.reactionContainerRight),
              }}
            >
              <Text style={{ ...styles.text, fontSize: 10 }}>
                {key}{' '}
                {Number(message.reactions?.get(key)) > 1 &&
                  String(message.reactions?.get(key))}
              </Text>
            </View>
          ))}
      </View>
      {showEmojis && (
        <View
          style={{
            ...styles.reactionEmojis,
            ...(message.self && styles.reactionEmojisRight),
          }}
        >
          {['❤️', '😂', '😮', '😢', '😡', '👍'].map((emoji) => (
            <TouchableOpacity onPress={() => handleReaction(emoji)} key={emoji}>
              <Text style={{ fontSize: 22 }}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  text: {
    color: Colors['dark'].text,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
  },
  msgWrapper: {
    padding: 10,
    // overflow: "hidden",
    borderRadius: 20,
    borderTopLeftRadius: 1,
    backgroundColor: Colors['dark'].background,
    alignSelf: 'flex-start',
  },

  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  avatar: {
    width: 20,
    marginRight: 5,
  },
  textSecondary: {
    color: Colors['dark'].text2,
    fontSize: 12,
  },
  reactionContainer: {
    padding: 2,
    paddingHorizontal: 5,
    backgroundColor: Colors['dark'].tint,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    top: -5,
    borderWidth: 1,
    alignSelf: 'flex-start',
    borderColor: '#ffffff2f',
  },
  reactionContainerRight: {
    alignSelf: 'flex-end',
    padding: 2,
    paddingHorizontal: 5,
    backgroundColor: Colors['dark'].secondary,
  },
  right: {
    alignSelf: 'flex-end',
  },
  msgWrapperRight: {
    borderTopRightRadius: 1,
    borderTopLeftRadius: 20,
    backgroundColor: Colors['dark'].tint,
    position: 'relative',
  },
  avatarWrapperRight: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  reactionWrapper: {
    flex: 1,
    width: '100%',
    gap: 5,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  reactionEmojis: {
    width: 300,
    backgroundColor: Colors['dark'].secondary,
    position: 'absolute',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ffffff0d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
  },
  reactionEmojisRight: {
    alignSelf: 'flex-end',
  },
});
