import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { scale } from 'react-native-size-matters';

export default function PlayerSessionInformation({ name, sessionType, connected }) {
    return (
        <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
                <Title style={styles.text}>{name}</Title>
            </View>
            <View style={styles.textContainer}>
                <Title style={styles.text}>{sessionType}</Title>
            </View>
            <View style={styles.textContainer}>
                <Title style={styles.text}>{connected ? "Device Connected" : "Device Not Connected"}</Title>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
    },
    text: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: "center",
        fontSize: scale(12),
        color: "red",
        textDecorationLine: "underline",
        textDecorationColor: "#00ff00",
        textDecorationStyle: "solid",
    }
})