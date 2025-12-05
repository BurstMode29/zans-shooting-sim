import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Provider, Subscribe } from 'unstated'

//  Config
import Colors from '../../config/colors'
import Layout from '../../config/layout'

import { Button } from 'react-native-paper';

//  Services 
import BluetoothManager from '../../services/BluetoothManager'

const DetailLine = ({ label, value }) => {
    return (
        <View style={styles.detailLineContainer}>
            <Text style={styles.detailText}>{label}</Text>
            <Text style={styles.detailText}>{value}</Text>
        </View>
    )
}

export default function SessionControls({ onReset, onBack, shots, accuracy, shooterName, reset = true, canSave, sessionType, diffFactor }) {
    return (
        <View style={styles.container}>
            <View style={styles.sessionDetailsContainer}>
                <Text style={styles.detailsLabel}>
                    Session
                </Text>
                <View style={styles.sep} />

                <DetailLine
                    label={"Shooter :"}
                    value={shooterName}
                />
                <DetailLine
                    label={"Difficulty :"}
                    value={`${diffFactor < 0.5 ? 'Very Easy' : diffFactor < 0.9 ? 'Easy' : 'Realistic'}`}
                />

                <DetailLine
                    label={"Shots :"}
                    value={shots}
                />
                <DetailLine
                    label={"Avg. Accuracy :"}
                    value={accuracy}
                />
                <Provider>
                    <Subscribe to={[BluetoothManager]}>
                        {
                            bluetoothManager =>
                                <DetailLine
                                    label={"Weapon status :"}
                                    value={bluetoothManager.state.deviceConnected ? 'Connected' : 'Disconnected'}
                                />
                        }
                    </Subscribe>
                </Provider>


            </View>
            {
                reset &&
                <Button
                    onPress={() => {
                        onReset()
                    }}
                >{canSave ? 'Save & reset' : 'Reset'}</Button>
            }

            <Button
                onPress={() => {
                    onBack()
                }}
            >{canSave ? 'Save & End session' : 'End session'}</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 300,
        height: 300
    },
    button: {
        marginBottom: 10
    },
    sessionDetailsContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        // height: 150,
        marginBottom: 10,
        width: 300,
        //marginTop: -40,
        paddingBottom: 15
    },
    detailsLabel: {
        color: 'white',
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10
    },
    sep: {
        height: 1,
        backgroundColor: Colors.offWhite,
        width: '100%',
        marginVertical: 10
    },
    detailLineContainer: {
        width: '100%',
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    detailText: {
        color: 'white',
        fontSize: 18
    }
})