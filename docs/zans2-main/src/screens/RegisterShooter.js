import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Button, TextInput,  } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import FirebaseManager from '../services/FirebaseManager';
import moment from 'moment'
import { goBack } from '../navigation/Routes';
import Snackbar from 'react-native-snackbar';
import { scale } from 'react-native-size-matters';

import bgImg from '../../assets/images/bg-blur.jpg';




export default function RegisterShooter({ route, navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [contactNum, setContactNum] = useState('')
    const [gender, setGender] = useState('male')
    const [idNum, setIdNum] = useState('')
    const session = route.params ?? null;

    numInputCheck = (value) => {
        if (/[a-zA-Z]/g.test(value)) {
            this.displayMessage('Please enter only digits');
            return false;
        }
        return true
    }

    displayMessage = (message) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
        })
    }

    validateFields = () => {
        return name.length > 0 && email.length > 0 && idNum.length > 0;
    }

    validateId = (id) => {
        if (id.length != 13) {
            return false;
        }
        return true;
    }

    registerUser = async () => {
        if (!validateFields()) {
            alert('Please complete all fields');
            return;
        }

        if (!validateId(idNum)) {
            alert("Invalid ID entered");
            return;
        }
        let timeRegistered = moment().format();
        let user = { "name": name, "email": email, "gender": gender, "contactNum": contactNum, "idNumber": idNum, "timeRegistered": timeRegistered }

        await FirebaseManager.writeShooter(user).then((result) => {
            this.displayMessage(result.message);
        });

        this.clearFields();
        if (session) {
            navigation.goBack();
        } else { 
            navigation.navigate("Signup");
        }

    }

    clearFields = () => {
        setName('');
        setEmail('');
        setContactNum('');
        setGender('male');
        setIdNum('');
    }

    getUsers = async () => {
        let me = await FirebaseManager.readShooters();
        console.log(me);
    }

    registerSuccess = () => {
        alert('success');
        goBack();
    }

    registerFailed = (error) => {
        alert(error)
    }

    return (
        <View style={InitWindowStyles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Register Shooter</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={InitWindowStyles.spacer}></View>
                    <View style={InitWindowStyles.rowContainer}>
                        <TextInput
                            label='Shooter Name'
                            style={InitWindowStyles.textInput}
                            value={name}
                            mode="outlined"
                            onChangeText={(name) => setName(name)} />
                    </View>
                    <View style={InitWindowStyles.rowContainer}>
                        <TextInput
                            label='Email'
                            style={InitWindowStyles.textInput}
                            value={email}
                            mode="outlined"
                            onChangeText={(email) => setEmail(email)} />
                    </View>
                   
                    <View style={InitWindowStyles.rowContainer}>
                        <View style={InitWindowStyles.text}>
                            <TextInput
                                label='Phone Number'
                                style={InitWindowStyles.textInput}
                                value={contactNum}
                                mode="outlined"
                                onChangeText={(value) => {
                                    if (numInputCheck(value)) {
                                        setContactNum(value)
                                    }
                                }
                                } />
                        </View>
                    </View>
                    <View style={InitWindowStyles.rowContainer}>
                        <View style={InitWindowStyles.text}>
                            <TextInput
                                label='Identification Number'
                                style={InitWindowStyles.textInput}
                                value={idNum}
                                mode="outlined"
                                onChangeText={(value) => {
                                    if (numInputCheck(value)) {
                                        setIdNum(value)
                                    }
                                }
                                } />
                        </View>
                    </View>
                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Gender</Text>
                        <Picker
                            style={InitWindowStyles.text}
                            dropdownIconColor={"#ff0000"}
                            onValueChange={(gender) => setGender(gender)}
                            selectedValue={gender}
                        >
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>
                    <View style={InitWindowStyles.rowContainer}>
                        <Button style={InitWindowStyles.text} mode="contained" onPress={registerUser}>
                            Confirm
                        </Button>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const InitWindowStyles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 20
    },
    text: {
        flex: 1,
        color: "white",
    },
    textInput: {
        flex: 1,
    }
});