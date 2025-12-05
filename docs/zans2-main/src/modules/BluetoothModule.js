import { Platform, NativeModules, NativeEventEmitter } from 'react-native';
import BluetoothSerial from "react-native-bluetooth-serial"

const WindowsEventEmitter = new NativeEventEmitter(NativeModules.BluetoothLEService);


//Marshal functions to call either Mobile or Windows bluetooth functions
export default function BluetoothModule() {
    //Connect to device
    async function connect(deviceAddress) {
        console.log("connecting through module");
        if (isWindows()) {
            return await NativeModules.BluetoothLEService.connect(deviceAddress);

        }
        else {
            return await BluetoothSerial.connect(deviceAddress);
        }
    };

    //Disconnect from device
    async function disconnect() {
        if (isWindows()) {
            return await NativeModules.BluetoothLEService.disconnect();
        }
        else {
            return await BluetoothSerial.disconnect();
        }
    };

    //Registers events and callbacks
    function on(eventName, handler) {
        if (isWindows()) {
            WindowsEventEmitter.addListener(eventName, handler, this);
        }
        else {
            BluetoothSerial.on(eventName, handler);
        }
    };

    isWindows = () => {
        return Platform.OS === 'windows'
    };

    return {
        connect: connect,
        disconnect: disconnect,
        on: on,
    };

}

//export default BluetoothModule