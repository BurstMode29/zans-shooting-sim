import React, { Component } from "react"
import moment from 'moment'
import { View, Text, Image, StyleSheet, Alert, ImageBackground } from "react-native"
import { Dimensions } from 'react-native';
import Marker, { ImageFormat } from 'react-native-image-marker'
import { Button, Title } from 'react-native-paper';
import TargetStatsCard from '../../components/target/TargetStatsCard';
import PlayerSessionInformation from '../../components/target/PlayerSessionInformation';
import Snackbar from 'react-native-snackbar';

import bgImg from '../../../assets/images/bg-blur.jpg';


//  Config
import Layout from "../../config/layout"
import Colors from "../../config/colors"
//  Assets
import TargetImage from "../../../assets/images/shooting-target.png"

const bg = require('../../../assets/images/shooting-target.png')
//  Services
import BluetoothManager from "../../services/BluetoothManager"
import FirebaseManager from '../../services/FirebaseManager'
import { Provider, Subscribe } from 'unstated'

import SoundPlayer from "react-native-sound-player";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

let w1;
let h1;

const MIN_DELAY = 2000
const MAX_DELAY = 6000
const TICK_RATE = 300

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


export default class ReflexTarget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activityStarted: false,
            isCountDown: false,
            isOpenFire: false,
            shooterName: "",
            shooterId: "",
            shotLimit: 15,
            shotsFired: 0,
            shotStatus: "PRESS START TO BEGIN",
            isShotFired: false,
            shots: [],
            accuracy: 0,
            diffFactor: 1,
            image: TargetImage,
            uri: '',
            image: bg,
            saveFormat: ImageFormat.png,
            totalShotCount: 0,
            testingShots: false,
            reactionTime: 0,
            currentShot: null,
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

        navigation.addListener('beforeRemove', this.onLeave);

        this.loadShots();

        this.setState({
            shooterName,
            shooterId,
            shotLimit,
            fbShots,
            diffFactor
        })
    }

    onShotFired = shot => {
        let { shots, shotLimit, shotsFired, activityStarted, isOpenFire, isCountDown, fbShots, currentShot } = this.state
        if (!activityStarted) {
            Snackbar.show({
                text: "Press start to begin",
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }
        if (isCountDown) {
            Snackbar.show({
                text: "Wait for countdown to complete",
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }

        if (!isOpenFire) {
            return;
        }

        if (shots.length > shotLimit - 1 || fbShots <= 0) {
            this.showAlert("Shot limit reached", "Save & reset to continue")
            this.handleSaveAndReset();
        } else {
            this.setState({ isShotFired: true, shotsFired: ++shotsFired });
            this.markImages(shot.x, shot.y);

            this.setState({
                currentShot: shot,
                fbShots: fbShots - 1,
                accuracy: this.getAverageAccuracy(shots)
            })
        }

    }

    formatTimeString(time) {
        let milliseconds = Math.floor(time);
        let seconds = Math.floor(time / 1000);
        let minutes = Math.floor(time / 60000);
        let hours = Math.floor(time / 3600000);
        milliseconds = milliseconds - seconds * 1000;
        seconds = seconds - minutes * 60;
        minutes = minutes - hours * 60;

        let formatted = seconds > 0 ? `${seconds}.${milliseconds}s` : `${milliseconds}ms`;
        return formatted;
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
        console.log("Stopping timer");
        clearInterval(this.timer);
        this.setState({
            activityStarted: false,
            shotStatus: "PRESS START TO BEGIN",
            shots: [],
            shotsFired: 0,
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

    setCountdown = (endFunc, count, duration) => {
        this.timer = setTimeout(() => {
            if (count <= 0) {
                endFunc();
            } else {
                this.setState({ shotStatus: count });
                this.playBeep();
                this.setCountdown(endFunc, count - 1, duration);
            }
        }, duration);

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
        if (this.timer) {
            clearTimeout(this.timer);
            clearInterval(this.timer);
            this.timer = null
        }
        this.setState({
            activityStarted: false,
            shotStatus: "PRESS START TO BEGIN"
        });
    }

    startButtonPress = () => {
        const { activityStarted, fbShots } = this.state;
        if (fbShots <= 0) {
            Snackbar.show({
                duration: Snackbar.LENGTH_LONG,
                text: "Insufficient Shots"
            });
            return;
        }
        if (!activityStarted) {
            this.startCountdown();
        } else {
            this.resetActivity();
        }
    }
    startCountdown = () => {
        this.setState({ activityStarted: true, isCountDown: true, });

        this.setCountdown(() => {
            this.setState({ shotStatus: "STAND BY", isCountDown: false });
            this.startTimer();
        }, 3, 1000);
    }

    startTimer = () => {
        const { shotLimit, shotsFired } = this.state;
        this.sessionLoop(shotsFired, shotLimit);

    }

    sessionLoop = (count, limit) => {

        let duration = Math.floor(Math.random() * MAX_DELAY) + MIN_DELAY
        if (count < limit) {
            console.log("Timer starting");
            this.timer = setTimeout(() => {
                this.waitForShot(() => {
                    count++;
                    this.sessionLoop(count, limit);
                });

            }, duration);

        } else {
            this.playLongBeep();
            this.setState({ activityStarted: false });
        }
    }

    waitForShot = (cb) => {
        this.setState({
            shotStatus: "SHOOT",
            isShotFired: false
        });
        this.playCountdownDoneBeep();
        const startTime = new Date().getTime();
        this.setState({ isOpenFire: true });
        this.timer = setInterval(() => {
            const currentTime = new Date() - startTime
            if (this.state.isShotFired) {
                this.setState({ isOpenFire: false });
                var { currentShot, shots } = this.state;

                const endTime = new Date().getTime() - startTime;
                currentShot.delaySeconds = endTime;
                shots.push(currentShot);
                this.setState({
                    shotStatus: this.formatTimeString(endTime),
                    shots,
                });
                this.stopTimer();
                cb();
            } else {
                this.onTimerTick();
            }
        }, TICK_RATE);
    }

    onTimerTick = () => {
        if (BluetoothManager.state.deviceConnected) {
            BluetoothManager.readData(this.onShotFired);
        }
    }

    stopTimer = () => {
        console.log("Stopping timer");
        clearInterval(this.timer);
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
                sessionType: 'reflex'
            });

            FirebaseManager.updateShots(totalShotCount - shots.length);
            this.loadShots(); //Updates totalshotcount after each reset
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
        const { shots, accuracy, shooterName, shooterId, shotsFired, shotLimit, diffFactor, testingShots } = this.state
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

                    <View style={{ flex: 0.1 }} />
                    <View style={styles.cueContainer}>
                        <Title style={styles.cueText}>{this.state.shotStatus}</Title>
                    </View>
                    <View style={{ flex: 0.4 }}>
                        <Provider>
                            <Subscribe to={[FirebaseManager]}>
                                {
                                    firebaseManager => <PlayerSessionInformation name={shooterName} sessionType={"Reflexes"} connected={BluetoothManager.state.deviceConnected} />
                                }

                            </Subscribe>
                        </Provider>
                    </View>
                    <View style={styles.accuracyContainer}>
                        <TargetStatsCard title={"Shots Left"} value={shotLimit - shotsFired} />
                        <TargetStatsCard title={"Last Shot"} value={`${lastShotAcc}%`} />
                        <TargetStatsCard title={"Average"} value={accuracy} />
                        <TargetStatsCard title={"Difficulty"} value={diffFactor} />
                    </View>
                    {
                        testingShots &&
                        <View style={styles.startActivityContainer}>
                            <Button mode="contained" onPress={() => this.onShotFired(
                                { x: 1, y: 1, accuracy: -12, delaySeconds: 3, gyr: { x: 1, y: 2, z: 3 }, acc: { x: 1, y: 2, z: 3 } },
                            )} >
                                Shoot!
                        </Button>
                        </View>

                    }
                    <View style={styles.buttonContainer}>
                        <View style={styles.startActivityContainer}>
                            <Button mode="contained" onPress={this.startButtonPress} style={styles.button} disabled={shotLimit - shotsFired <= 0}>
                                {this.state.activityStarted ? "Stop" : "Start"}
                            </Button>
                        </View>
                        <View style={styles.startActivityContainer}>
                            <Button mode="contained" onPress={this.handleSaveAndReset} style={styles.button}>
                                Reset and Save Activity
                        </Button>
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
    buttonContainer: {
        flexDirection: "row",
        width: "100%"
    },
    startActivityContainer:
    {
        flex: 1,
        margin: 5
    },
    cueText:
    {
        flex: 1,
        padding: 1,
        alignSelf: "center",
    },
    cueContainer:
    {
        flex: 0.2,
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

        flex: 0.5,
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
        flex: 0.3,
        width: "50%",
        flexDirection: "row",
        alignSelf: "center",
        alignContent: "center",
    },
    text: {
        flex: 1,
    },

})
