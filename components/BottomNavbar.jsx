import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOR } from '../utils/Theme'
// import * as FAIcon from 'react-native-vector-icons/FontAwesome6'
import Icon from 'react-native-vector-icons/Octicons'

const BottomNavbar = () => {
    return (
        <View style={styles.container}>
            <NavbarBtn icon={() => (
                <Icon name={'telescope'} color={COLOR.baseWhite} size={25} />
            )} title={'Discover'} />
            {/* <NavbarBtn icon={() => (
                <FAIcon name={'clock-rotate-left'} color={COLOR.baseWhite} size={25} />
            )} title={'Recent'} /> */}
        </View>
    )
}

export default BottomNavbar

const NavbarBtn = ({ icon, title }) => {
    return (
        <View style={styles.btn}>
            {icon()}
            <Text style={styles.text}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: COLOR.baseBlack,
        width: '100%',
        height: 60,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    text: {
        color: COLOR.baseWhite
    },
    btn: {
        alignItems: 'center',
    }
})