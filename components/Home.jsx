import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOR } from '../utils/Theme'
import Card from './Card'

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: COLOR.baseWhite,
    fontSize: 16,
    fontFamily: 'Inter-Regular'
  },
  mainView: {
    backgroundColor: COLOR.baseBlack,
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})