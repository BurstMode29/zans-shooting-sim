import React from 'react';
import { StyleSheet, Text, View,} from "react-native"
import { Button } from "react-native-paper";
import { scale } from "react-native-size-matters";
import { RNCamera } from "react-native-camera";
import Snackbar from 'react-native-snackbar';

import BarcodeMask from 'react-native-barcode-mask';

export default function ScanQR({ route, navigation }) {

    function onBarCodeRead(result) {
        console.log(result);
        if (result.type === "QR_CODE") {
            onSuccess(result);
        }
        else {
            Snackbar.show({
                duration: Snackbar.LENGTH_SHORT,
                text: "Use a compatible QR Code found on the device"
            })
        }
    }

    function onSuccess(e) {
        navigation.navigate('ConfigureTarget', { device: e.data });
    }

    return (
        <View style={styles.root}>

            <RNCamera
                style={styles.camera}
                onBarCodeRead={onBarCodeRead}
                type={RNCamera.Constants.Type.front}
                autoFocus={true}
                focusable={true}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            >
                <View style={styles.topSection}>
                    <Text style={{color: "white", fontSize: scale(20), margin: 4}}>Hold the QR Code within view</Text>
                </View>
                <View style={{flex: 1}}>
                    <BarcodeMask

                        showAnimatedLine={false} outerMaskOpacity={0}
                    />
                </View>
                <View style={styles.lowerSection}>
                <Button onPress={() => { navigation.goBack() }} mode="contained" >Cancel</Button>
            </View>
            </RNCamera>
            
        </View>
    );

    return (
        <View style={styles.topContainer}>
            <View style={styles.bannerContainer} >
                <Text style={styles.bannerText}>Hold QR code to camera</Text>
            </View>
            <RNCamera
                type={RNCamera.Constants.Type.back}
                ref={ref => {
                    this.camera = ref;
                }}
                flashMode={RNCamera.Constants.FlashMode.off}
                style={{
                    flex: 1, justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                    console.log(barcodes);
                }}

                children={<BarcodeMask />}
            />


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