import React from 'react';
import { StyleSheet, Text, View } from "react-native"
import { Button } from "react-native-paper";
import { scale } from "react-native-size-matters";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import Snackbar from 'react-native-snackbar';

import BarcodeMask from 'react-native-barcode-mask';

export default function ScanQR({ route, navigation }) {
    const device = useCameraDevice('back');

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            if (codes.length > 0) {
                const code = codes[0];
                console.log(code);
                if (code.type === 'qr') {
                    onSuccess(code);
                } else {
                    Snackbar.show({
                        duration: Snackbar.LENGTH_SHORT,
                        text: "Use a compatible QR Code found on the device"
                    })
                }
            }
        }
    });

    function onSuccess(code) {
        navigation.navigate('ConfigureTarget', { device: code.value });
    }

    if (device == null) {
        return (
            <View style={styles.root}>
                <Text style={{ color: "white" }}>Loading camera...</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            >
                <View style={styles.topSection}>
                    <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Hold the QR Code within view</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <BarcodeMask
                        showAnimatedLine={false}
                        outerMaskOpacity={0}
                    />
                </View>
                <View style={styles.lowerSection}>
                    <Button onPress={() => { navigation.goBack() }} mode="contained" >Cancel</Button>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({

    bannerContainer: {
        backgroundColor: "#1f1f1f",
        alignItems: "center",
        padding: 8,
        width: "100%",
        flex: 1,
    },
    bannerText: {
        color: "black",
        fontSize: scale(20),
        textAlignVertical: "center",
        margin: 4,
        flex: 1,
    },
    root: {
        flexGrow: 1,
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: "black",
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    safeContainer: {
        flex: 1,
    },
    topSection: {
        backgroundColor: "#1f1f1f",
        padding: 8,
        flex: 0,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center'
    },
    lowerSection: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: "100%",
        flex: 0,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },

})