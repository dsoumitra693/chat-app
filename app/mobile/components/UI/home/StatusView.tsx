import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import StatusCircle from './StatusCircle';

const STATUS_DATA = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

const StatusView = () => {
  return (
    <ScrollView contentContainerStyle={styles.statusView} horizontal>
      {STATUS_DATA.map((status, index) => (
        <StatusCircle key={index} />
      ))}
    </ScrollView>
  );
};

export default StatusView;

const styles = StyleSheet.create({
  statusView: {
    height: 80,
    zIndex: 100,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
});
