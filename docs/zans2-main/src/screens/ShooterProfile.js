import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, } from 'react-native';
import { Text, } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import FirebaseManager from '../services/FirebaseManager';
import bgImg from '../../assets/images/bg-blur.jpg';


import SessionCard from '../components/sessions/SessionCard';

export default function ShooterProfile({ route, navigation }) {
    const { shooter, userKey } = route.params;
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState({
        shooterName: "None",
        sessionType: "None",
        date: "None"
    })

    useEffect(() => {
        this.fetchSessions(shooter);
    }, []);

    fetchSessions = async (shooterInformation) => {
        console.log({ shooterInformation })
        setIsLoading(true);

        const resultSessions = await FirebaseManager.readSessions();
        if (resultSessions != null) {
            let filteredSessions = [];
            console.log(resultSessions);
            Object.keys(resultSessions).map((key) => {
                if (resultSessions[key]["shooterId"] === userKey) {
                    filteredSessions.push(resultSessions[key]);
                }
            });
            setSessions(filteredSessions);
        } else {
            setSessions(null);
        }

        setIsLoading(false);

    }

    onSessionCardPress = (session) => {
        navigation.navigate('SessionDetail', { sessionData: session, shooterInfo: shooter })
    }

    generateSessionList = () => {
        if (isLoading) {
            return (<View styles={InitWindowStyles.rowContainer}><Text style={InitWindowStyles.text}>Loading...</Text></View>)
        } else if (sessions == null || sessions.length == 0) {
            return (<View styles={InitWindowStyles.rowContainer}><Text style={InitWindowStyles.text}>No Recorded Sessions</Text></View>)
        }



        return sessions.slice(0).reverse().map((session) => (<SessionCard sessionData={session} onPress={() => onSessionCardPress(session)} />))
    }

    getNames = (data) => {
        let names = ["None"]
        {
            data.map((session) => {

                if (!names.find(value => value === session.ShooterName)) {
                    names.push(session.shooterName);
                }
            })
        }

        return (names.map((person) => {
            return (<Picker.Item label={person} value={person} />)
        }))
    }

    getDates = (data) => {
        if (data == null) {
            return null;
        }
        let dates = ["None"]
        data.slice(0).reverse().map((session) => {
            let tempDate = session.date.substring(0, 10);
            if (!dates.find(value => value.substring(0, 10) === tempDate)) {
                dates.push(session.date);
            }
        })

        return (dates.map((date) => {
            return (<Picker.Item label={date.substring(0, 10)} value={date} />)
        }))
    }

    checkFilter = (session, filter) => {
        let result = true;

        console.log(session.name)
        if (filter.shooterName && filter.shooterName !== "None" && !session.shooterName.toUpperCase().startsWith(filter.shooterName.toUpperCase(), 0)) {
            result = false
        }

        if (filter.date && filter.date !== "None" && session.date !== filter.date) {
            result = false
        }

        if (filter.sessionType && filter.sessionType !== "None" && session.sessionType !== filter.sessionType) {
            result = false
        }

        return result;
    }


    return (
        <View style={InitWindowStyles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <View style={InitWindowStyles.rowContainer}>

                    <Picker
                        style={InitWindowStyles.text}
                        dropdownIconColor={"#ff0000"}
                        selectedValue={filter.date}
                        onValueChange={(value, index) => setFilter({
                            shooterName: filter.shooterName,
                            date: value,
                        })}
                    >
                        {this.getDates(sessions)}
                    </Picker>
                </View>
                <View style={{ flex: 8 }}>
                    <ScrollView>

                        {this.generateSessionList()}
                        {/*sessions.map((session, index) => {
                    return checkFilter(session, filter) ? <SessionCard sessionData={session} onPress={() => navigation.navigate('SessionDetail', { sessionData: session })}></SessionCard> : null
                })*/}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View >
    );
}


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
        flex: 1,
        textAlign: 'center',
        color: "white",
    },
    textInput: {
        flex: 1,
    },
});