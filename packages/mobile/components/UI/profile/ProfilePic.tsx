import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IMAGE_1, IMAGE_2 } from '@/constants/data';

const ProfilePic = () => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: IMAGE_1 }} style={styles.image} />
    </View>
  );
};

export default ProfilePic;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
  },
});
