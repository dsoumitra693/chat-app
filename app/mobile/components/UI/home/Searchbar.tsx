import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const Searchbar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search anything"
          placeholderTextColor={Colors['dark'].text2}
          cursorColor={Colors['dark'].text2}
        />
        <Ionicons
          name="search-outline"
          size={28}
          color={Colors['dark'].text2}
        />
      </View>
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors['dark'].secondary,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
  },
  input: {
    width: '90%',
    height: '100%',
    fontSize: 18,
    color: '#FFF',
  },
});
