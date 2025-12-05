import React, { Component } from "react"
import moment from 'moment'
import { View, Text, Image, StyleSheet, Alert, ImageBackground } from "react-native"
import { Dimensions } from 'react-native';
import Marker, { ImageFormat } from 'react-native-image-marker'
import { Button, Divider, Title } from 'react-native-paper';
import TargetStatsCard from '../../components/target/TargetStatsCard';
import bgImg from '../../../assets/images/bg-blur.jpg';
import Snackbar from 'react-native-snackbar';

import PlayerSessionInformation from '../../components/target/PlayerSessionInformation';



//  Config
import Layout from "../../config/layout"
import Colors from "../../config/colors"
//  Assets
import TargetImage from "../../../assets/images/shooting-target.png"

const bg = require('../../../assets/images/shooting-target.png')
//  Components
import SoundPlayer from 'react-native-sound-player'
//  Services
import BluetoothManager from "../../services/BluetoothManager"
import FirebaseManager from '../../services/FirebaseManager'

import { Provider, Subscribe } from "unstated";

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


const TICK_RATE = 300


export default class TimetrialTarget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shooterName: "",
            shooterId: "",
            shotLimit: 15,
            shots: [],
            accuracy: 0,
            diffFactor: 1,
            time: 0,
            timeFormatted: "00:00:00",
            activityStarted: false,
            isCountDown: false,
            timeLimit: 10,
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
        const { shooterName, shooterId, shotLimit, diffFactor, timeLimit, fbShots } = this.props.route.params;

        BluetoothManager.setDifficulty(diffFactor);

        navigation.addListener('beforeRemove', this.onLeave);

        this.loadShots();

        this.setState({
            shooterName,
            shooterId,
            shotLimit,
            timeLimit,
            diffFactor,
            fbShots,
        })


    }

    onShotFired = shot => {
        const { shots, shotLimit, activityStarted, isCountDown, time, fbShots } = this.state
        console.log(time)
        if (!activityStarted || isCountDown || shots.length > shotLimit - 1 || fbShots <= 0) {
            if (isCountDown) {
                Snackbar.show({
                    text: "Wait for countdown before firing",
                    duration: Snackbar.LENGTH_SHORT,
                })
            }
            else if (!activityStarted) {
                this.showAlert("Activity not started");
            }
            else if (shots.length > shotLimit - 1 || fbShots <= 0) {
                this.showAlert("Shot limit reached", "Save & reset to continue");
            }
        } else {
            shots.push(shot)
            this.setState({
                fbShots: fbShots - 1,
                shots,
                accuracy: this.getAverageAccuracy(shots)
            })
        }

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

            navigation.dispatch(e.data.action);
        }
    }

    resetActivity = () => {
        console.log("Stopping timer");
        if (this.timer) {
            clearTimeout(this.timer);
            clearInterval(this.timer);
            this.timer = null;
        }
        this.setState({
            shots: [],
            accuracy: 0,

            activityStarted: false,
            isCountDown: false,
            time: 0,
            timeFormatted: '00:00:00'
        });
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
        console.log("Stopping timer");
        clearInterval(this.timer);
        this.saveSession()
        this.setState({
            activityStarted: false,
            time: 0,
            timeFormatted: '00:00:00',
            shots: [],
            accuracy: 0
        })
    }

    handleSaveAndEnd = () => {
        const { navigation } = this.props
        this.saveSession()
        navigation.navigate("SelectProgram")
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

    saveSession = () => {
        const { shots, shooterName, shooterId, accuracy, diffFactor, totalShotCount } = this.state
        if (shots.length > 2) {
            FirebaseManager.writeSession({
                shots,
                accuracy,
                shooterId: shooterId,
                shooterName: shooterName,
                date: moment().format(),
                diffFactor,
                sessionType: 'timetrial'
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

    playBeep = () => {
        try {
            SoundPlayer.playSoundFile('beep', 'mp3')
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
    }

    playLongBeep = () => {
        try {
            SoundPlayer.playSoundFile('timerdone', 'mp3')
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
    }

    playCountdownDoneBeep = () => {
        try {
            SoundPlayer.playSoundFile('longbeep', 'mp3')
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
    }

    setCountdown = (cb, count, duration) => {
        this.timer = setTimeout(() => {
            this.setState({ countdownAt: count })
            this.playBeep()
            if (count <= 0) {
                cb();
            } else {
                this.setCountdown(cb, count - 1, duration);
            }
        }, duration);

    }

    startCountdown = () => {

        this.setState({ activityStarted: true, isCountDown: true });
        this.setCountdown(() => {
            this.playCountdownDoneBeep();
            this.startTimer();
        }, 3, 1000)
    }

    startTimer = () => {
        this.setState({ isCountDown: false });

        console.log("Timer starting");
        const endTime = new Date().getTime() + (this.state.timeLimit * 1000) + 1000
        this.timer = setInterval(() => {
            const remaining = endTime - new Date();
            if (remaining <= 1000) {
                this.setState({
                    time: 0,
                    timeFormatted: '00:00:00'
                });
                this.stopTimer();
                return;
            }
            this.onTimerTick(remaining);
        }, TICK_RATE);
    }

    onTimerTick = (remainingTime) => {
        this.setState({
            time: remainingTime,
            timeFormatted: this.formatTimeString(remainingTime)
        })
        if (BluetoothManager.state.deviceConnected) {
            BluetoothManager.readData(this.onShotFired)
        }
    }

    formatTimeString(time) {  
        let seconds = Math.floor(time / 1000);
        let minutes = Math.floor(time / 60000);
        let hours = Math.floor(time / 3600000);
        seconds = seconds - minutes * 60;
        minutes = minutes - hours * 60;
        let formatted = `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ? 0 : ""
            }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
        return formatted;
    }

    stopTimer = () => {
        this.setState({ activityStarted: false });
        if (this.timer) {
            clearTimeout(this.timer);
            clearInterval(this.timer);
            this.timer = null;
        }
        this.playLongBeep()
    }

    startButtonPress = () => {
        const { fbShots, shots } = this.state;
        if (fbShots <= 0) {
            Snackbar.show({
                duration: Snackbar.LENGTH_LONG,
                text: "Insufficient Shots"
            })
            return;
        }

        if (!this.state.activityStarted) {
            if (shots.length > 0) {
                Snackbar.show({
                    duration: Snackbar.LENGTH_LONG,
                    text: "Save and reset before starting a new session"
                })
                return;
            }
            this.startCountdown();
        } else {
            this.resetActivity();
        }
    }



    render() {
        const { shots, accuracy, shooterName, diffFactor, testingShots } = this.state
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
                    <View style={styles.timerContainer}>
                        <Title style={styles.timer}>{this.state.timeFormatted}</Title>
                    </View>
                    <View style={{ flex: 0.4 }}>
                        <Provider>
                            <Subscribe to={[FirebaseManager]}>
                                {
                                    firebaseManager => <PlayerSessionInformation name={shooterName} sessionType={"Time Trial"} connected={BluetoothManager.state.deviceConnected} />
                                }

                            </Subscribe>
                        </Provider>
                    </View>
                    <Divider />
                    <View style={{ flex: 0.1 }}></View>
                    <View style={styles.accuracyContainer}>
                        <TargetStatsCard title="SHOTS FIRED" value={shotsFired} style={styles.statCard} />
                        <TargetStatsCard title="LAST SHOT" value={`${lastShotAcc}%`} style={styles.statCard} />
                        <TargetStatsCard title="AVG" value={`${accuracy}%`} style={styles.statCard} />
                        <TargetStatsCard title="DIFF" value={diffFactor} style={styles.bstatCard} />
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
                        <View style={styles.startActivityContainer}>
                            <Button mode="contained" onPress={this.startButtonPress}>
                                {this.state.activityStarted ? "Stop" : "Start"}
                            </Button>
                        </View>
                        <View style={styles.startActivityContainer}>
                            <Button mode="contained" onPress={this.handleSaveAndReset}>
                                Reset and Save Activity</Button>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        flex: 1,
    },
    statCard: {
        flex: 1,
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
    timer:
    {
        flex: 1,
        padding: 1,
        alignSelf: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%"
    },
    startActivityContainer:
    {
        flex: 1,
        margin: 5
    },
    timerContainer:
    {
        flex: 0.2
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
        flex: 2,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    accuracyContainer: {
        flex: 0.4,
        flexDirection: "row"
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
        flex: 0.3,
        width: "50%",
        flexDirection: "row",
        alignSelf: "center",
        alignContent: "center",
    },
    text: {
        flex: 1,
    }

})
