import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

const MuteText = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        padding: 10,
        backgroundColor: `${Colors['dark'].secondary}88`,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: Colors['dark'].text }}>You muted the call.</Text>
    </View>
  );
};

export default MuteText;

const styles = StyleSheet.create({});
