import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Avatar,} from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const sessionTypes = {
    "accuracy": "Accuracy",
    "reflex": "Reflexes",
    "timetrial": "Time Trial"
}

function SessionAvatar({ sessionData }) {
    if (sessionData.sessionType == "accuracy") {
        return <Avatar.Icon icon="bullseye" />;
    }
    else if (sessionData.sessionType == "reflex") {
        return <Avatar.Icon icon="lightning-bolt-outline" />;
    }
    else {
        return <Avatar.Icon icon="alarm" />;

    }
}

export default function SessionCard({ sessionData, ...rest }) {
    return (
        <Pressable style={styles.card} {...rest}>
            <View style={styles.cardRow}>
                <View>
                    <Text style={styles.titleText}>{sessionTypes[sessionData.sessionType]}</Text>
                    <View style={InitWindowStyles.cardContent}>
                        <View style={InitWindowStyles.text}>
                            <Text style={styles.text}>{sessionData.date.substring(11, 16)}</Text>
                            <Text style={styles.text}>{sessionData.date.substring(0, 10)}</Text>
                        </View>
                    </View>
                </View>
                <SessionAvatar sessionData={sessionData} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "column",
        borderRadius: 8,
        backgroundColor: "#1f1f1f",
        padding: 20,
        margin: 4,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    titleText: {
        color: "white",
        fontSize: moderateScale(22),
        margin: 4,
    },
    text: {
        color: "white",
        fontSize: moderateScale(12),
        margin: 4,
    }
});

const InitWindowStyles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
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
    cardContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    target: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    text: {
        flex: 1
    },
    textInput: {
        flex: 1,
    },
});