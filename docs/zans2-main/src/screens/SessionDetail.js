import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, ScrollView, ImageBackground, Text, Linking } from 'react-native';
import { Avatar, Button, } from 'react-native-paper';
import { AccuracySessionDetail, TimetrialSessionDetail, ReflexesSessionDetail } from '../components/sessions/SessionDetailTypes';
import AccuracyCard from '../components/graphs/AccuracyCard';
import Layout from '../config/layout'
import TargetImage from "../assets/images/shooting-target.png"
import Mailer from 'react-native-mail';
import Snackbar from 'react-native-snackbar';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { moderateScale } from 'react-native-size-matters';
import { request, check, RESULTS, PERMISSIONS } from 'react-native-permissions';

import bgImg from '../../assets/images/bg-blur.jpg';

var RNFS = require('react-native-fs');

const sessionTypes = {
    "accuracy": "Accuracy",
    "reflex": "Reflexes",
    "time": "Time Trial",
    "timetrial": "Time Trial"
}

function SessionRoutes({ sessionData }) {
    if (sessionData.sessionType == "accuracy") {
        return <AccuracySessionDetail sessionData={sessionData} />;
    }
    else if (sessionData.sessionType == "reflex") {
        return <ReflexesSessionDetail sessionData={sessionData} />;
    }
    else {
        return <TimetrialSessionDetail sessionData={sessionData} />;

    }
}

function SessionAvatar({ sessionData }) {
    if (sessionData.sessionType == "accuracy") {
        return <Avatar.Icon icon="bullseye" />;
    }
    else if (sessionData.sessionType == "reflex") {
        return <Avatar.Icon icon="lightning-bolt-outline" />;
    }
    else {
        return <Avatar.Icon icon="alarm" />;

    }
}

const TARGET_WIDTH = 411
const TARGET_HEIGHT = 924
const SHOT_DIAMATER = 30
const TARGET_LEFT_OFFSET = (Layout.fullscreen.width - TARGET_WIDTH) / 2

const Shot = ({ x, y, size, index }) => {


    return (
        <View
            style={[
                InitWindowStyles.shot,
                {
                    left: TARGET_WIDTH / 2 - SHOT_DIAMATER / 2 + TARGET_LEFT_OFFSET + x,
                    top: TARGET_HEIGHT / 2 - SHOT_DIAMATER / 2 - y
                }
            ]}
        >
            <View style={InitWindowStyles.shotInner} ><Text style={{ color: 'lightgrey', marginTop: 13, width: 20 }}>{index + 1}</Text></View>
        </View>
    )
}


export default function SessionDetail({ route, navigation }) {
    const { sessionData, shooterInfo } = route.params
    const [imgSrc, setImgSrc] = useState(null);
    const [testing, setTesting] = useState(false);
    const topViewShot = useRef(null);
    const targetViewShot = useRef(null);
    const graphViewShot = useRef(null);

    async function checkPermissions() {
        var allowed = false;
        var result = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        if (result == RESULTS.GRANTED) {
            return true;
        } else if (result == RESULTS.DENIED) {
            console.log("Write Storage: Denied\t requesting...");
            var requestResult = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            if (requestResult == RESULTS.GRANTED) {
                return true;
            } else {
                console.log("Write Storage: Denied by user");
                Snackbar.show({
                    text: "Permission to write to storage is needed",
                    duration: Snackbar.LENGTH_LONG,
                })
                return false;
            }
        } else if (result == RESULTS.BLOCKED) {
            console.log("Write Storage: Denied by user\tOpening settings...");
            Snackbar.show({
                text: "Please allow storage permissions in the settings",
                duration: Snackbar.LENGTH_LONG,
            })
            setTimeout(() => {
                Linking.openSettings();
            }, 3000);
            
            return false;
        }

        console.log("Write Storage: Not Available or Blocked");
        return false;
    }

    async function emailRecord() {
        if (!(await checkPermissions())) {
            return;
        }
        let { result, attachments } = await buildEmailBody();
        const to = shooterInfo['email'];

        Mailer.mail({
            recipients: [to],
            subject: 'Session Report',
            body: result,
            attachments: attachments,
            isHTML: true,
        }, (error, event) => { console.log(error) })
    }

    async function buildEmailBody() {
        let result = '';
        let newline = '<br>';

        result += 'Zans Shooting Simulator' + newline + newline;
        result += `Date: ${sessionData.date.substring(0, 10)}` + newline + newline;

        result += `Attached is the ${sessionTypes[sessionData.sessionType]} session report for ${shooterInfo['name']}` + newline;

        var attachments = [];

        var top = await saveToLocal(await CaptureImage(topViewShot), "Profile", "jpg");
        attachments.push({
            path: top,
            type: "jpg",
            name: "Profile"
        });

        var target = await saveToLocal(await CaptureImage(targetViewShot), "Target", "jpg");
        attachments.push({
            path: target,
            type: "jpg",
            name: "Target"
        });

        var graphs = await saveToLocal(await CaptureImage(graphViewShot), "Graphs", "jpg");
        attachments.push({
            path: graphs,
            type: "jpg",
            name: "Graphs"
        });

        return { result, attachments };
    }

    async function CaptureImage(ref) {
        var uri = await captureRef(ref.current, {
            format: "jpg",
            quality: 0.8
        })
        return uri
    }

    async function saveToLocal(uri, filename, filetype) {
        const urlComponents = uri.split('/')
        const fileNameAndExtension = urlComponents[urlComponents.length - 1]
        const destPath = `${RNFS.PicturesDirectoryPath}/${filename}.${filetype}`
        await RNFS.copyFile(uri, destPath).catch((error) => console.log("Failed to save " + error));
        return destPath;
    }

    return (
        <View style={InitWindowStyles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1, }}>
                <ScrollView>
                    <ViewShot ref={topViewShot} options={{
                        format: "jpg",
                        quality: 1.0
                    }}
                        captureMode="mount">
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <Text style={styles.titleText}>{sessionTypes[sessionData.sessionType]}</Text>
                                <SessionAvatar style={InitWindowStyles.text} sessionData={sessionData}></SessionAvatar>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={InitWindowStyles.playerDetail}>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>Date</Text>
                                </View>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>{sessionData.date.substring(0, 10)}</Text>
                                </View>
                            </View>

                            <View style={InitWindowStyles.playerDetail}>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>Time</Text>
                                </View>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>{sessionData.date.substring(11, 16)}</Text>
                                </View>
                            </View>

                            <View style={InitWindowStyles.playerDetail}>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>Difficulty</Text>
                                </View>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>{sessionData.diffFactor}</Text>
                                </View>
                            </View>

                            <View style={InitWindowStyles.playerDetail}>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>Total shots</Text>
                                </View>
                                <View style={InitWindowStyles.playerDetail}>
                                    <Text style={styles.text}>{sessionData.shots.length}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <AccuracyCard title={"Average Accuracy"} description={"Your average accuracy during the session"} sessionData={sessionData} />
                        </View>
                    </ViewShot>

                    <ViewShot ref={targetViewShot} options={{
                        format: "jpg",
                        quality: 1.0
                    }}
                        captureMode="mount">
                        <View style={InitWindowStyles.targetContainer}>
                            <Image source={TargetImage} style={InitWindowStyles.target} onLayout={(event) => {
                                const { width, height } = event.nativeEvent.layout;
                                console.log({ width, height })
                            }} />
                            {sessionData.shots.map((shot, index) => {
                                return <Shot x={shot.x} y={shot.y} key={index} index={index} />
                            })}
                        </View>
                    </ViewShot>
                    <ViewShot ref={graphViewShot} options={{
                        format: "jpg",
                        quality: 1.0
                    }}
                        captureMode="mount">

                        <View style={[InitWindowStyles.rowContainer, { alignSelf: "center" }]}>
                            <SessionRoutes sessionData={sessionData} />
                        </View>
                    </ViewShot>
                    {
                        testing &&
                        <View>
                            <View collapsable={false} style={[InitWindowStyles.rowContainer, { alignSelf: "center" }]}>
                                <Button onPress={onImageLoad}>Capture</Button>
                            </View>
                            <View collapsable={false} style={[InitWindowStyles.rowContainer, { alignSelf: "center" }]}>
                                <Image source={{ uri: imgSrc }} style={styles.container}></Image>
                            </View>
                        </View>
                    }

                    <View collapsable={false} style={[InitWindowStyles.rowContainer, { alignSelf: "center" }]}>
                        <Button onPress={emailRecord}>Print Record</Button>
                    </View>

                </ScrollView>
            </ImageBackground>

        </View >
    );
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
        borderRadius: 5,
        height: "10%",
        justifyContent: "center"
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
    card: {
        flex: 1,
        flexDirection: "column",
        borderRadius: 8,
        backgroundColor: "#1f1f1f",
        padding: 20,
        margin: 16,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    cardContent: {

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
    root: {
        flex: 1,
        flexDirection: "column",
    },
    playerDetail: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    targetContainer: {
        flex: 0.1,
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
        borderRadius: 4
    },
});