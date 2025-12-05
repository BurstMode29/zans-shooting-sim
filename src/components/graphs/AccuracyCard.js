import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { ProgressChart } from 'react-native-chart-kit';
import { moderateScale, scale } from 'react-native-size-matters';

export default function AccuracyCard({ title, description, sessionData, ...rest }) {
    const percentage = sessionData.accuracy / 100;
    const blue = (100 * percentage + 20) | 0;
    const green = (255 * percentage) | 0;
    const red = (255 - green) | 0;

    console.log("Percentage " + percentage);
    console.log("Green " + green)

    const chartConfig = {
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`,

    }

    return (
        <View style={styles.card} {...rest}>
            <View style={InitWindowStyles.rowContainer}>
                <View style={{flex: 1}}>
                    <Text style={styles.titleText}>{title}</Text>
                    <View style={{flex: 0.5}}/>
                    <Text style={styles.text}>
                        {description}
                    </Text>
                </View>
                <ProgressChart height={moderateScale(100)} width={moderateScale(100)} data={{ data: [percentage] }} chartConfig={chartConfig} style={styles.chart}></ProgressChart>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "column",
        borderRadius: 8,
        backgroundColor: "#1f1f1f",
        padding: 20,
        margin: 16,
    },
    chart: {
        flex: 0.5,
    },  
    titleText: {
        color: "white",
        fontSize: moderateScale(22),
    },
    text: {
        color: "white",
        fontSize: moderateScale(12),
        margin: 4,
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
        justifyContent: "space-between"
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
    text: {
        flex: 1
    },
    textInput: {
        flex: 1,
    },
});