import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const Heading = () => {
  return (
    <View style={styles.heading}>
      <Text style={styles.text1}>
        Messages
        <Text style={styles.text2}>
          {' '}
          48 <Text style={styles.text3}>New</Text>
        </Text>
      </Text>
      <Ionicons name="create-outline" color={'#2ACBE2'} size={28} />
    </View>
  );
};

export default Heading;

const styles = StyleSheet.create({
  heading: {
    width: '100%',
    height: 70,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  text1: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },

  text2: {
    fontSize: 18,
    color: '#2ACBE2',
  },
  text3: {
    fontSize: 14,
  },
});
