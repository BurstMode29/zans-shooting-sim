import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export default function PlayerCard({ title, email, ...rest }) {
    return (
        <Pressable style={InitWindowStyles.root} {...rest}>
            <View style={styles.textContainer}>
                <Text style={InitWindowStyles.titleText}>{title}</Text> 
            </View>
            <View style={{flex: 0.1}}></View>
            <View style={styles.textContainer}>
                <Text style={InitWindowStyles.text}>{email}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { margin: 5 },
    textContainer: {
        margin: 4,
        flex: 1
    },
});

const InitWindowStyles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "column",
    },
    root: {
        flex: 1,
        flexDirection: "column",
        borderRadius: 8,
        backgroundColor: "#1f1f1f",
        padding: 20,
        margin: 4,
    },
    playerDetail: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 20
    },
    cardContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 20,
        borderRadius: 5,
    },
    target: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    titleText: {
        flex: 1,
        fontSize: moderateScale(22),
        color: "white",
    },
    text: {
        flex: 1,
        fontSize: moderateScale(16),
        color: "white",
    },
    textInput: {
        flex: 1,
    },
});