import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CardGraph from '../graphs/CardGraph';

export default function AccuracySessionDetail({ sessionData }) {
    
    return (
        <View>
            <CardGraph
                title={"Accuracy"}
                description={"Percentage accuracy per shot."}
                labels={sessionData.shots.map((shot, index) => { return `${index + 1}` })}
                datasets={[{ data: sessionData.shots.map((shot, index) => { return shot.accuracy }) }]}>
            </CardGraph>
            <CardGraph
                title={"Shot Placement"}
                description={"X and Y coordinates per shot, 0 is center of target."}
                labels={sessionData.shots.map((shot, index) => { return `${index + 1}` })}
                datasets={[{
                    data: sessionData.shots.map((shot, index) => { return shot.x })
                }, {
                    data: sessionData.shots.map((shot, index) => { return shot.y })
                }]}>
            </CardGraph>
            <CardGraph
                title={"Shot Stability"}
                description={"X, Y and Z gyroscope readings per shot. Less variation means more stability."}
                labels={sessionData.shots.map((shot, index) => { return `${index + 1}` })}
                datasets={[{
                    data: sessionData.shots.map((shot, index) => { return shot.gyr.x })
                }, {
                    data: sessionData.shots.map((shot, index) => { return shot.gyr.y })
                }, {
                    data: sessionData.shots.map((shot, index) => { return shot.gyr.z })
                }]}>
            </CardGraph>
            <CardGraph
                title={"Shot Steadiness"}
                description={"X, Y and Z accelerometer readings per shot. Less variation means more stability."}
                labels={sessionData.shots.map((shot, index) => { return `${index + 1}` })}
                datasets={[{
                    data: sessionData.shots.map((shot, index) => { return shot.acc.x })
                }, {
                    data: sessionData.shots.map((shot, index) => { return shot.acc.y })
                }, {
                    data: sessionData.shots.map((shot, index) => { return shot.acc.z })
                }]}>
            </CardGraph>
        </View>
    );
}

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
    cardContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 20,
        borderRadius: 5,
    },
    target: {
        resizeMode: "center",
    },
    text: {
        flex: 1
    },
    textInput: {
        flex: 1,
    },
});