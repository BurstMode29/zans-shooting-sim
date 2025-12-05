import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import FormButton from '../components/FormButton';
import { TextInput, Divider, Text } from 'react-native-paper';
import { register } from '../services/midlayer'
import { scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';

import backgroundImage from '../../assets/images/bg-blur.jpg';

export default function SignupEmailScreen({ route, navigation }) {
    const [email, setEmail] = useState('');
    useEffect(() => {
        setEmail(route.params.email);
    }, []);
    const [password, setPassword] = useState('');
    const [cpassword, setConfirmPassword] = useState('');

    displayMessage = (message) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
        })
    }

    validateFields = () => {
        if (email.length == 0) {
            this.displayMessage("Enter a valid email address")
            return;
        } else if (password.length < 8) {

            this.displayMessage("Enter an 8 character long password")
            return;
        } else if (password !== cpassword) {

            this.displayMessage("Passwords do not match")
            return;
        } else {
            this.doSignUp();
        }
    }

    doSignUp = async () => {
        const registerStatus = await register(email, password)
        if (registerStatus.success) {
            console.log("Successful registration")
            navigation.navigate('Home');
        }
        else {
            console.log(registerStatus.message);
            this.displayMessage(registerStatus.message);
        }

    }

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={styles.image}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8, width: "100%" }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Email Sign Up</Text>
                    </View>
                </View>
                <ScrollView style={styles.scrollBackground}>
                    <View style={{ flex: 0.1 }} />
                    <View style={styles.middleContainer}>
                        <View style={styles.inputView} >
                            <TextInput style={styles.inputText}
                                label='Email'
                                value={email}
                                placeholderTextColor="#003f5c"
                                onChangeText={(email) => setEmail(email)} />

                        </View>
                        <Divider style={{flex: 1}}></Divider>
                        <View style={styles.inputView} >
                            <TextInput style={styles.inputText}
                                label='Password'
                                value={password}
                                secureTextEntry
                                onChangeText={(password) => setPassword(password)} />
                        </View>
                        <View style={styles.inputView} >
                            <TextInput style={styles.inputText}
                                label='Confirm Password'
                                value={cpassword}
                                secureTextEntry
                                onChangeText={(password) => setConfirmPassword(password)} />
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <View style={styles.buttonContainer}>
                            <FormButton
                                title='Cancel'
                                modeValue='contained'
                                labelStyle={styles.button}
                                onPress={navigation.goBack}
                            />
                            <View style={{ flex: 0.1 }} />
                            <FormButton
                                title='Confirm'
                                modeValue='contained'
                                labelStyle={styles.button}
                                onPress={validateFields}
                            />
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        flexDirection: "column",
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: "center",
        justifyContent: "space-between"

    },
    logo: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "100%"
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        flex: 1,
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",

    },
    button: {
        padding: 8,
    },
    scrollBackground: {
        flex: 1,
        padding: 8,
        width: "100%",
        flexDirection: "column",
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    inputView: {
        width: "100%",
        justifyContent: "center",
        margin: 12,
        flex: 1,
    },
    inputText: {
        flex: 1,
    },
});