import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

//  Assets
import Target from '../../../assets/images/target.png'
import Reflexes from '../../../assets/images/lightning.png'
import Time from '../../../assets/images/time.png'
//  Config
import Colors from '../../config/colors'

const label = {
    time: 'Time Trail',
    reflexes: 'Reflexes',
    accuracy: 'Accuracy'
}

const asset = {
    time: Time,
    reflexes: Reflexes,
    accuracy: Target
}

export default function SessionTypeIndicator({ type, containerStyles = {} }) {
    return (
        <View style={[styles.sessionTypeContainer, containerStyles]}>
            <Text style={styles.typeLabel}>{label[type]}</Text>
            <Image
                source={asset[type]}
                style={[styles.iconImage, { height: type === 'reflexes' ? 50 : 30, width: type === 'reflexes' ? 28 : 30 }]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    sessionTypeContainer: {
        backgroundColor: Colors.button,
        width: 300,
        height: 60,
        marginBottom: 10,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    typeLabel: {
        fontSize: 27,
        color: 'white'
    },
    iconImage: {
        height: 30,
        width: 30
    }
})