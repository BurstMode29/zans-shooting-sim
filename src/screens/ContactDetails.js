import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Linking,  } from 'react-native';
import bgImg from '../../assets/images/bg-blur.jpg';
import { scale } from 'react-native-size-matters';
import Mailer from 'react-native-mail';
export default function ContactDetails({ navigation }) {

    const email = "admin@shootingsimulator.co.za";
    const sms = "083 578 6683";

    function emailPress() {
        Mailer.mail({
            recipients: [email]
        }, (error, event) => { console.log(error) });
    }

    function smsPress() {
        Linking.openURL("sms:" + sms);
    }

    function RowEntry({ title, value, onPress }) {
        return (
            <View style={styles.entryContainer}>
                <Pressable style={styles.rowContainer} onPress={onPress}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{title}</Text>
                    </View>
                    <View style={[styles.textContainer, {flex: 2}]}>
                        <Text style={styles.text}>{value}</Text>
                    </View>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Contact Details</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.payContainer}>
                        <RowEntry title={"Email"} value={email} onPress={emailPress} />
                        <RowEntry title={"Telephone"} value={sms} onPress={smsPress}/>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
    },
    rowContainer: {
        padding: 16,
        justifyContent: "space-between",
        textAlign: 'auto',
        flexDirection: "row",
    },
    payContainer: {
        flex: 1,
        margin: 30
    },
    textInput: {
        flex: 1,
    },
    textContainer: {
        justifyContent: "flex-start",
        flex: 1,
    },
    bottomContainer: {
        justifyContent: "space-evenly",
        margin: 12,
        flex: 1
    },
    container: {
        flex: 2
    },
    entryContainer: {
        justifyContent: "center"
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
    text: {
        textAlign: "left",
        fontSize: scale(14),
        color: "white",
    },
});
