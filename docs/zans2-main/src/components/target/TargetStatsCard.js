import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
export default function TargetStatsCard({ title, value }) {
    return (
        <View style={styles.flipcard}>
            <View style={styles.flipcardcontent}>
                <Text style={styles.flipcardvalue}>{value}</Text>
            </View>
            <View style={styles.flipcardcontentname}>
                <Text style={styles.flipcardtext}>{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flipcard: {
        backgroundColor: "white",
        flex: 1,
        margin: 4,
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    flipcardcontent: {
        alignItems: "center",
        flex: 1
    },

    flipcardtext: {
        fontWeight: "bold",
        color: "black",
        fontSize: 12,
        flex: 1,
    }
    ,
    flipcardvalue: {
        fontWeight: "bold",
        color: "black",
        fontSize: 20,
        textAlignVertical: "center",
        flex: 1,
    }
    ,
    flipcardcontentname: {
        alignItems: "center",
        flex: 1,

    },
})