import React, { useState } from 'react';
import { View, Image, ImageBackground, StyleSheet } from 'react-native';
import FormButton from '../components/FormButton';
import imageLogo from "../../assets/images/logo.png";
import { TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { login } from '../services/midlayer'
import { GoogleSignIn } from '../services/FirebaseSocialAuth';
import Snackbar from 'react-native-snackbar';
import { moderateScale } from 'react-native-size-matters';

import backgroundImage from '../../assets/images/bg-blur.jpg';




export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
        } else {
            this.doSignUp();
        }
    }

    doSubmit = async () => {
        const loginStatus = await login(email, password)
        if (loginStatus.success) {
            console.log('LOGIN_SUCCESS')
            navigation.navigate('Home')
        } else {
            console.log(loginStatus.message)
            this.displayMessage("Email/Password incorrect");
        }
    }

    doSignUp = () => {
        console.log({ email });
        navigation.navigate('EmailSignup', { email: email });
    }

    doGoogleSignUp = async () => {

        setLoading(true);
        try {
            await GoogleSignIn();
            navigation.navigate('Home')
        } catch (error) {
            console.log(error);
        }
        setLoading(false);

    }

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={styles.image}>
                <View style={{ flex: 0.1 }} />
                <Image source={imageLogo} style={styles.logo} />
                <View style={{ flex: 0.6 }}></View>
                <View style={styles.middleContainer}>
                    <View style={styles.inputView} >
                        <TextInput style={styles.inputText}
                            label='Email'
                            value={email}
                            placeholderTextColor="#003f5c"
                            onChangeText={(email) => setEmail(email)} />

                    </View>
                    <View style={styles.inputView} >
                        <TextInput style={styles.inputText}
                            label='Password'
                            value={password}
                            secureTextEntry
                            onChangeText={(password) => setPassword(password)} />

                    </View>
                </View>
                <View style={{ flex: 0.1 }}></View>
                <View style={styles.bottomContainer}>
                    <View style={{ flex: 1, margin: 12 }}>

                        <FormButton
                            title='Login'
                            modeValue='contained'
                            labelStyle={styles.loginButtonLabel}
                            onPress={doSubmit}
                        />
                        <FormButton
                            title='New user? Join here'
                            modeValue='text'
                            uppercase={false}
                            labelStyle={styles.navButtonText}
                            onPress={doSignUp}
                        />
                        <View style={{ flex: 0.1 }}></View>
                        <Text style={styles.text}>Sign in with different method?</Text>
                        {
                            !loading && <FormButton

                                title="Sign in with Google"
                                icon="google"
                                modeValue='contained'
                                uppercase={false}
                                labelStyle={styles.loginButtonLabel}
                                onPress={doGoogleSignUp}
                            />
                        }
                        {
                            loading && <ActivityIndicator />
                        }

                    </View>

                </View>
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
    navButtonText: {
        textDecorationLine: 'underline',
        fontSize: moderateScale(12),
    }
    ,
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
        width: "100%",
        margin: 12,
    },
    bottomContainer: {
        flex: 1,
        width: "90%",
    },
    inputView: {
        width: "100%",
        borderRadius: 25,
        height: 50,
        marginBottom: 30,
        justifyContent: "center",
        padding: 10,
    },
    text: {
        color: 'white',
        alignSelf: 'center',
        fontSize: moderateScale(12),
    }
});