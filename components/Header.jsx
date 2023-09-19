import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOR } from '../utils/Theme'
import Icon from 'react-native-vector-icons/Feather'

const Header = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Discover</Text>
            <View style={styles.flex}>
                <View style={styles.msgContainer}>
                    <Text style={styles.msgText}>50% on PRO</Text>
                </View>
                <Icon name='user' size={20} color={COLOR.baseWhite} />
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    container: {
        width: '100%',
        backgroundColor: COLOR.baseBlack,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        borderBottomColor: COLOR.boderWhite,
        borderBottomWidth: 0.5,
    },
    headerText: {
        fontFamily: 'Inter-Regular',
        fontSize: 20,
        color: COLOR.baseWhite,
        fontWeight: '400',
    },
    msgText: {
        ...this.headerText,
        fontSize: 16,
    },
    msgContainer: {
        backgroundColor: COLOR.basePink,
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

})