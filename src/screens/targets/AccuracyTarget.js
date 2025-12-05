import React, { Component } from "react"
import moment from 'moment'
import { View, Text, Image, StyleSheet, Alert, ImageBackground } from "react-native"
import { Dimensions } from 'react-native';
import Marker, { ImageFormat } from 'react-native-image-marker'
import { Button, Divider,} from 'react-native-paper';
import TargetStatsCard from '../../components/target/TargetStatsCard';
import PlayerSessionInformation from '../../components/target/PlayerSessionInformation';
import Snackbar from 'react-native-snackbar';

import bgImg from '../../../assets/images/bg-blur.jpg';




//  Config
import Layout from "../../config/layout"
import Colors from "../../config/colors"
//  Assets
import TargetImage from "../../../assets/images/shooting-target.png"

const bg = require('../../../assets/images/shooting-target.png');
//  Services
import BluetoothManager from "../../services/BluetoothManager"
import FirebaseManager from '../../services/FirebaseManager'

import { Provider, Subscribe } from 'unstated'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

let w1;
let h1;

var TARGET_WIDTH = 700
var TARGET_HEIGHT = 700
const SHOT_DIAMATER = 30
const TARGET_LEFT_OFFSET = (Layout.fullscreen.width - TARGET_WIDTH) / 2

const Shot = ({ x, y, index, width, height }) => {
    let tLeftOffset = (Layout.fullscreen.width - width) / 2

    return (
        <View
            style={[
                styles.shot,
                {
                    //left: TARGET_WIDTH / 2 - SHOT_DIAMATER / 2 + TARGET_LEFT_OFFSET + x,
                    left: width / 2 - SHOT_DIAMATER / 2 + tLeftOffset + x,
                    //top: TARGET_HEIGHT / 2 - SHOT_DIAMATER / 2 - y
                    top: height / 2 - SHOT_DIAMATER / 2 - y
                    //left: x,
                    //top: y
                }
            ]}
        >
            <View style={styles.shotInner} ><Text style={{ color: 'lightgrey', marginTop: 13, width: 20 }}>{index + 1}</Text></View>
        </View>
    )
}


export default class AccuracyTarget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shooterName: "",
            shooterId: "",
            shotLimit: 15,
            shots: [],
            accuracy: 0,
            diffFactor: 1,
            image: TargetImage,
            uri: '',
            image: bg,
            saveFormat: ImageFormat.png,
            totalShotCount: 0,
            testingShots: false,
        }
    }

    loadShots = async () => {
        let numShots = await FirebaseManager.readShots();
        if (numShots == null) {
            numShots = 0;
        }
        this.setState({
            totalShotCount: numShots
        })
    }

    componentDidMount = () => {
        const { navigation } = this.props
        const { shooterName, shooterId, shotLimit, diffFactor, fbShots } = this.props.route.params;
        BluetoothManager.setDifficulty(diffFactor);

        this.loadShots();

        navigation.addListener('beforeRemove', this.onLeave);

        this.setState({
            shooterName,
            shooterId,
            shotLimit,
            diffFactor,
            fbShots
        })

        if (BluetoothManager.state.deviceConnected) {
            console.log("polling for data");
            BluetoothManager.pollForData(this.onShotFired)
        }


    }

    onShotFired = shot => {
        let { shots, shotLimit, fbShots } = this.state
        if (shots.length > shotLimit - 1) {
            this.showAlert("Shot limit reached", "Save & reset to continue")
            return;
        }
        if (fbShots <= 0) {
            Snackbar.show({
                duration: Snackbar.DURATION_LONG,
                text: "Insufficient Shots"
            })
            return;
        }

        this.markImages(shot.x, shot.y);
        shots.push(shot)
        this.setState({
            shots,
            fbShots: fbShots - 1,
            accuracy: this.getAverageAccuracy(shots)
        })

    }

    markImages = (x, y) => {
        Marker.markText({
            src: this.state.image,
            text: 'text marker',
            X: width,
            Y: height,
            color: 'red',
            fontName: 'Arial-BoldItalicMT',
            fontSize: 44,
            scale: 1,
            quality: 100,
            saveFormat: ImageFormat.png
        }).then((res) => {
            this.setState({
                loading: false,
                uri: this.state.saveFormat === ImageFormat.base64 ? res : Platform.OS === 'android' ? 'file://' + res : res,
            })
        }).catch((err) => {
            this.setState({
                loading: false,
                err
            })
        })
    }

    componentWillUnmount = () => {
        BluetoothManager.stopPoll()
    }

    handleSaveAndReset = () => {
        console.log("Saving and resetting")
        this.saveSession()
        this.setState({
            shots: [],
            accuracy: 0
        })
    }

    handleSaveAndEnd = () => {
        const { navigation } = this.props
        this.saveSession()
        navigation.navigate("SelectProgram")
    }

    onLeave = (e) => {
        const { shots } = this.state
        const { navigation } = this.props
        e.preventDefault();
        if (shots.length > 2) {
            Alert.alert(
                'End Session?',
                'You are still in a session. Are you sure you want to leave?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Save and leave',
                        style: 'destructive',
                        onPress: () => {
                            this.handleSaveAndReset();
                            navigation.dispatch(e.data.action);
                        }
                    },
                ]
            );
        } else {
            BluetoothManager.stopPoll();
            navigation.dispatch(e.data.action);
        }
    }

    getAverageAccuracy = shots => {
        if (shots.length === 0) {
            return 0
        } else {
            const accuracies = shots.map(shot => shot.accuracy)
            const total = accuracies.reduce((acc, c) => (c >= 0 ? c : 0) + acc, 0);
            let avg = total / accuracies.length
            return Math.round(avg * 100) / 100
        }
    }

    startTimer = () => {
        if (BluetoothManager.state.deviceConnected) {
            BluetoothManager.pollForData(this.onShotFired)
        }
    }

    saveSession = () => {
        const { shots, shooterName, shooterId, accuracy, diffFactor, totalShotCount } = this.state
        if (shots.length > 0) {
            FirebaseManager.writeSession({
                shots,
                accuracy,
                shooterId: shooterId,
                shooterName: shooterName,
                date: moment().format(),
                diffFactor,
                sessionType: 'accuracy'
            });

            FirebaseManager.updateShots(totalShotCount - shots.length);
            this.loadShots();
        }
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



    render() {
        const { shots, accuracy, shooterName, shotLimit, diffFactor, testingShots } = this.state
        let shotsFired = shots.length;
        var acc = shots.length !== 0 ? shots[shots.length - 1].accuracy : 0;
        let lastShotAcc = acc >= 0 ? acc : 0
        let lastShotColor = lastShotAcc < 50 ? Colors.red : lastShotAcc < 75 ? Colors.orange : Colors.green
        let canSave = shots.length > 1

        return (
            <View style={styles.container}>
                <ImageBackground source={bgImg} style={{ flex: 1 }}>
                    <Image onLayout={(evt) => {
                        const { width, height } = evt.nativeEvent.layout
                        w1 = width;
                        h1 = height;
                    }} source={TargetImage} style={styles.logo} />
                    {shots.map((shot, index) => {
                        if (shot.accuracy < 0) {
                            return null;
                        }
                        return <Shot x={shot.x} y={shot.y} width={w1} height={h1} key={index} index={index} />
                    })}
                    <Divider />
                    <View style={{ flex: 0.2 }}>
                        <Provider>
                            <Subscribe to={[FirebaseManager]}>
                                {
                                    firebaseManager => <PlayerSessionInformation name={shooterName} sessionType={"Accuracy"} connected={BluetoothManager.state.deviceConnected} />
                                }

                            </Subscribe>
                        </Provider>
                    </View>
                    <Divider />
                    <View style={styles.accuracyContainer}>
                        <TargetStatsCard title={"Shot Left"} value={shotLimit - shotsFired} />
                        <TargetStatsCard title={"Last Shot"} value={`${lastShotAcc}%`} />
                        <TargetStatsCard title={"Average"} value={accuracy} />
                        <TargetStatsCard title={"Difficulty"} value={diffFactor} />
                    </View>
                    {
                        testingShots &&
                        <View style={styles.startActivityContainer}>
                            <Button mode="contained" onPress={() => this.onShotFired(
                                { x: 1, y: 1, accuracy: 12, delaySeconds: 3, gyr: { x: 1, y: 2, z: 3 }, acc: { x: 1, y: 2, z: 3 } },
                            )} >
                                Shoot!
                        </Button>
                        </View>

                    }
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={() => {
                            this.handleSaveAndReset()
                        }} style={styles.button}>
                            Reset and Save Activity
                                </Button>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "space-between",
    },
    button: {
    },
    buttonContainer: {
        margin: 5
    },
    row:
    {
        borderTopColor: "red",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "red",
        borderBottomWidth: StyleSheet.hairlineWidth,
        textAlign: "right",
        alignItems: "center"

    },
    cell:
    {
        borderRightColor: "red",
        borderRightWidth: StyleSheet.hairlineWidth,

    },
    cellText:
    {
        textTransform: "capitalize",
        color: "red",

    },
    preview: {
        width,
        height: 300,
        flex: 1,
    },
    logo: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    accuracyContainer: {
        flex: 0.3,
        flexDirection: "row",
    },
    shotInner: {
        backgroundColor: "rgba(255, 31, 31, 1)",
        height: 8,
        width: 8,
        borderRadius: 4
    },
    shot: {
        height: SHOT_DIAMATER,
        width: SHOT_DIAMATER,
        backgroundColor: "rgba(209, 0, 0, 0.69)",
        borderRadius: 15,
        position: "absolute",
        ...Layout.center
    },
    shotInner: {
        backgroundColor: "rgba(255, 31, 31, 1)",
        height: 8,
        width: 8,
        borderRadius: 0
    },
    targetWrapper: {
        width: Layout.center.width,
        ...Layout.center
    },
    target: {
        height: TARGET_HEIGHT,
        width: TARGET_WIDTH
    },
    rowContainer: {
        flex: 0.1,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    text: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15
    }

})

