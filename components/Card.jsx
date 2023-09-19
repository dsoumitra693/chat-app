import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOR } from '../utils/Theme'
import { randomNum } from '../utils/randomNum'
import Icon from 'react-native-vector-icons/'

const Card = () => {
    let color_keys = Object.keys(COLOR)
    const color = COLOR[color_keys[randomNum(2)]]
    return (
        <View style={styles.card(color)}>
            <View style={[styles.section, styles.topSection]}>
                <View style={styles.iconWrapper}>
                    <Text>Icon</Text>
                </View>
            </View>
            <View style={[styles.bottomSection, styles.section]}>
                <Text style={styles.text}>What's at the end of the universe?</Text>
            </View>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: (color) => ({
        width: 160,
        height: 180,
        backgroundColor: color,
        marginBottom: 10,
        borderRadius: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
    }),
    section: {
        height: '50%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'

    },
    topSection: {
        alignItems: 'flex-start',
        paddingLeft: 20,
    },
    bottomSection: {
        verticalAlign: 'middle',
        paddingHorizontal: 10
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.boderWhite,
    },
    text: {
        fontSize: 20,
        verticalAlign: 'middle',
        fontWeight: '600',
        fontFamily: 'Inter-Regular',
        color: COLOR.baseBlack
    }
})