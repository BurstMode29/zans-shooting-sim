import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, } from 'react-native';
import { Button} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Provider, Subscribe } from 'unstated'
import BluetoothManager from '../services/BluetoothManager'
import FirebaseManager from '../services/FirebaseManager';
import Slider from '@react-native-community/slider';
import { moderateScale, scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';

import bgImg from '../../assets/images/bg-blur.jpg';


export default class ConfigureTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionType: "",
            deviceStatusLoading: false,
            shooterName: null,
            shooterId: null,
            timeLimit: 5,
            shotLimit: 5,
            reflexShots: 10,
            timetrialTime: 10,
            loadingNames: false,
            diffFactor: 25,
            fbShots: null,
        };

    }

    componentDidMount = () => {

        this.props.navigation.addListener('focus', () => {
            //('ConfigureTarget focused');
            //console.log(this.props.route.params);
            const { device } = this.props.route.params

            this.onReturn(device);

        });

        //console.log(this.props);
        const { type } = this.props.route.params;
        this.loadShooters();
        this.loadShots();

        this.setState({
            sessionType: type,
        })

    }

    loadShooters = async () => {
        this.setState({
            loadingNames: true,
        })
        const users = await FirebaseManager.readShooters();
        console.log(users);

        this.setState({
            shooters: users
        });

    }

    loadShots = async () => {
        this.setState({ loadingNames: true });
        const shots = await FirebaseManager.readShots();
        console.log({ shots });
        this.setState({
            loadingNames: false,
            fbShots: shots
        });
    }

    generatePicker = () => {
        const { loadingNames, shooterId, shooters, shooterName } = this.state;
        const { navigation } = this.props
        if (loadingNames) {
            return (<Text style={InitWindowStyles.text}>Loading...</Text>)
        } else if (shooters == null) {
            return (<Button mode="contained" onPress={() => this.props.navigation.navigate("RegisterShooter", { session: this.state.sessionType })}>Register a Shooter</Button>)
        }
        if (shooterName == null) {
            let key = Object.keys(shooters)[0];
            this.setState({
                shooterName: shooters[key]["name"],
                shooterId: key
            });
        }
        return (
            <Picker
                style={InitWindowStyles.text}
                dropdownIconColor={"#ff0000"}
                selectedValue={shooterId}
                itemStyle={InitWindowStyles.text}

                onValueChange={(id) => {
                    if (id === "-1") {
                        navigation.navigate("RegisterShooter", { session: this.state.sessionType })
                    } else {
                        this.setState({
                            shooterId: id,
                            shooterName: shooters[id]["name"]
                        })
                    }
                }}
            >
                {
                    Object.keys(shooters).map((key) => {
                        return (<Picker.Item label={shooters[key]["name"]} value={key} />)
                    })
                }
                <Picker.Item label={"Create a new Shooter"} value={"-1"} key={-1}></Picker.Item>
            </Picker >
        )

    }

    onReturn = async (device) => {
        this.loadShooters();
        this.loadShots();
        if (device && !BluetoothManager.state.deviceConnected) {
            this.setState({ deviceStatusLoading: true })
            let connDevice = await BluetoothManager.connect(device)
            if (!connDevice) {
                //this.showAlert('Cant find weapon', 'Please make sure the weapon module is powered on')
            }
            this.setState({ deviceStatusLoading: false })
        }
    }

    onConnect = async () => {
        const { navigation } = this.props

        navigation.navigate('ScanQR')
        // this.setState({deviceStatusLoading: true})
        // await BluetoothManager.connect()
        // this.setState({deviceStatusLoading: false})
    }

    onDisconnect = () => {
        BluetoothManager.disconnect()
    }

    showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                { text: 'OK' },
            ],
            { cancelable: true },
        );
    }

    navigateToTarget = () => {
        const { sessionType, timeLimit, shooterName, shotLimit, diffFactor } = this.state
        const { navigation } = this.props
        if (sessionType === 'time') {
            Tracker.log('START_SESSION_TIMETRAIL', { shooterName })
            navigation.navigate("TimetrailTarget", { type: sessionType, timeLimit, shooterName, diffFactor: diffFactor })
        }
        if (sessionType === 'reflexes') {
            Tracker.log('START_SESSION_REFLEXES', { shooterName })
            navigation.navigate("ReflexTarget", { type: sessionType, shooterName, diffFactor: diffFactor })
        }
        if (sessionType === 'accuracy') {
            Tracker.log('START_SESSION_ACCURACY', { shooterName })
            navigation.navigate("AccuracyTarget", { type: sessionType, shooterName, shotLimit, diffFactor: diffFactor })
        }

    }

    eligbleToPlay = async () => {
        await this.loadShots();
        const { fbShots, sessionType, shotLimit, isLoading, reflexShots } = this.state
        if (isLoading) {
            return {
                "value": false,
                "message": "Loading shooters..."
            };
        }
        var result = true;
        if (fbShots == null) {
            result = false;
        } else if (sessionType === "accuracy" && shotLimit > fbShots) {
            result = false;
        } else if (sessionType === "reflexes" && reflexShots > fbShots) {
            result = false;
        } else if (sessionType === "timetrial" && fbShots < 1) {
            result = false;
        }
        return result ? {
            "value": true
        } : {
                "value": false,
                "message": "Insufficient Shots"
            };
    }

    startSession = async () => {
        //console.log("start SESSION");
        const { shooterName, shooterId, sessionType, reflexShots, timetrialTime, shotLimit, diffFactor, fbShots } = this.state
        var eligble = await this.eligbleToPlay();
        if (!eligble.value) {
            Snackbar.show({
                duration: Snackbar.LENGTH_LONG,
                text: eligble.message
            });
            return;
        }
        var difficulty = diffFactor / 10
        const { navigation } = this.props;
        switch (sessionType) {
            case "accuracy":
                navigation.navigate("AccuracyTarget", { type: sessionType, shooterName, shooterId, shotLimit: shotLimit, diffFactor: difficulty, fbShots })
                break;
            case "reflexes":
                navigation.navigate("ReflexTarget", { type: sessionType, shooterName, shooterId, shotLimit: reflexShots, diffFactor: difficulty, fbShots })
                break;
            case "timetrial":
                navigation.navigate("TimetrialTarget", { type: sessionType, shooterName, shooterId, diffFactor: difficulty, timeLimit: timetrialTime, fbShots })
                break;
        }
    }

    getHint = () => {
        //console.log("start SESSION");
        const { sessionType } = this.state
        let hint = "";
        switch (sessionType) {
            case "accuracy":
                hint = "Take your time and try and shoot as accurately as possible.";
                break;
            case "reflexes":
                hint = "Stand with your back facing the target and wait for the beep. When you hear the beep, turn around and shoot a single shot as accurately and quickly as possible."
                break;
            case "timetrial":
                hint = "After the countdown, fire shots as accurately as possible before the time limit runs out."
                break;
        }
        return hint;
    }

    onBack = () => {
        const { navigation } = this.props
        navigation.navigate("SelectProgram")
    }

    render() {
        const { navigation } = this.props
        const { deviceStatusLoading, sessionType, shooterName, timeLimit, shotLimit, diffFactor } = this.state
        const sessions = {
            "accuracy": "Accuracy",
            "timetrial": "Time Trial",
            "reflexes": "Reflexes"
        }

        return (
            <ImageBackground source={bgImg} style={InitWindowStyles.root}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>{sessions[sessionType]}</Text>
                    </View>
                    <View>
                        <Text style={{ color: "white", fontSize: scale(14), margin: 4 }}>Configure Target</Text>
                    </View>
                </View>
                <ScrollView style={InitWindowStyles.scrollBackground}>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Choose a Shooter</Text>
                        {this.generatePicker()}
                    </View>
                    {sessionType === "accuracy" &&
                        <View style={InitWindowStyles.rowContainer}>
                            <Text style={InitWindowStyles.text}>Shot Limit</Text>
                            <Picker
                                dropdownIconColor={"#ff0000"}
                                onValueChange={(value, index) => { this.setState({ shotLimit: value }) }}
                                selectedValue={shotLimit}
                                style={InitWindowStyles.textInput}
                                itemStyle={InitWindowStyles.text}
                            >
                                <Picker.Item label="5" value={5} />
                                <Picker.Item label="10" value={10} />
                                <Picker.Item label="15" value={15} />
                            </Picker>
                        </View>
                    }
                    {sessionType === "timetrial" &&
                        <View style={InitWindowStyles.rowContainer}>
                            <Text style={InitWindowStyles.text}>Time</Text>
                            <Picker
                                style={InitWindowStyles.text}
                                dropdownIconColor={"#ff0000"}
                                selectedValue={this.state.timetrialTime}
                                onValueChange={(value, index) => { this.setState({ timetrialTime: value }) }}
                                itemStyle={InitWindowStyles.text}

                            >
                                <Picker.Item label="5 seconds" value={5} />
                                <Picker.Item label="10 seconds" value={10} />
                                <Picker.Item label="15 seconds" value={15} />
                            </Picker>
                        </View>
                    }
                    {sessionType === "reflexes" &&
                        <View style={InitWindowStyles.rowContainer}>
                            <Text style={InitWindowStyles.text}>Number of Shots</Text>
                            <Picker
                                style={InitWindowStyles.text}
                                dropdownIconColor={"#ff0000"}
                                selectedValue={this.state.reflexShots}
                                onValueChange={(value, index) => { this.setState({ reflexShots: value }) }}
                                itemStyle={InitWindowStyles.text}
                            >
                                <Picker.Item label="5" value={5} />
                                <Picker.Item label="10" value={10} />
                                <Picker.Item label="15" value={15} />
                            </Picker>
                        </View>
                    }
                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Difficulty</Text>
                        <Text style={InitWindowStyles.text}>{diffFactor / 10}</Text>
                        <Slider

                            style={{ flex: 2 }}
                            value={diffFactor}
                            onValueChange={(value) => {
                                this.setState({ diffFactor: value });
                                console.log(diffFactor);
                            }}
                            minimumValue={10.0}
                            maximumValue={50.0}
                            minimumTrackTintColor="red"
                            thumbTintColor="white"
                            step={1} />
                    </View>
                    <View style={InitWindowStyles.columnContainer}>
                        <Text style={InitWindowStyles.text}>{`Tip: ${this.getHint()}`}</Text>
                    </View>

                    <View >
                        <Provider>
                            <Subscribe to={[BluetoothManager]}>
                                {
                                    bluetoothManager =>

                                        <Button style={styles.button} color="white" icon={bluetoothManager.state.deviceConnected ? null : "bluetooth-connect"} mode="contained" onPress={bluetoothManager.state.deviceConnected ? this.startSession : this.onConnect}>
                                            <Text style={{ color: bluetoothManager.state.deviceConnected ? "green" : "black" }}>{
                                                bluetoothManager.state.deviceConnected ? "Start" : "Connect"
                                            }</Text>
                                        </Button>
                                }
                            </Subscribe>
                        </Provider>
                    </View>
                    <View >
                        <Provider>
                            <Subscribe to={[BluetoothManager]}>
                                {
                                    bluetoothManager => {
                                        return bluetoothManager.state.deviceConnected ?

                                            <Button style={styles.button} mode="contained" onPress={this.onDisconnect}>
                                                Disconnect
                                    </Button> : null
                                    }

                                }
                            </Subscribe>
                        </Provider>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    formView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around"

    },
    rowSwitch:
    {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    button:
    {
        margin: 10,
        flex: 0.1,
        borderRadius: 5,
        height: "10%",
        justifyContent: "center",

    },
    inputView: {
        width: "100%",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        marginTop: 50,
        justifyContent: "center",
        padding: 10,
    },
});

const InitWindowStyles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 25
    },
    columnContainer: {
        flex: 1,
        flexDirection: "column",
        alignSelf: "center",
        alignItems: "center",
        margin: 30
    },
    scrollBackground: {
        alignSelf: "center",
        width: "100%",
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    text: {
        flex: 1,
        color: "white",
        fontSize: moderateScale(16),
    },
    textInput: {
        flex: 1,
        color: "white",

    }
});