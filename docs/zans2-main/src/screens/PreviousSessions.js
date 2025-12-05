import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ImageBackground, } from 'react-native';
import { Text, TextInput,} from 'react-native-paper';
import PlayerCard from '../components/PlayerCard'
import FirebaseManager from '../services/FirebaseManager';
import GlobalContext from '../components/contexts/GlobalContext';
import { scale } from 'react-native-size-matters';

import bgImg from '../../assets/images/bg-blur.jpg';

export default function PreviousSessions({ navigation }) {
    const shooterContext = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [shooters, setShooters] = useState({});
    const [hasLoaded, setHasLoaded] = useState(false);
    const [filter, setFilter] = useState({
        email: "None",
    })

    const emails = []

    shooterContext.setCurrentPage("Player History");

    useEffect(() => {
        fetchData();
    }, []);

    fetchData = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);

        let resultShooters = await FirebaseManager.readShooters();
        setShooters(resultShooters);
        shooterContext.setShooters(resultShooters);


        setIsLoading(false);
        setHasLoaded(true);
    }

    onPlayerCardPress = (shooterInformation, key) => {
        navigation.navigate("ShooterProfile", { shooter: shooterInformation, userKey: key });
    }

    generateShooterList = () => {
        let shooters = shooterContext.shooters;

        if (isLoading && !hasLoaded) {
            return null;
        } else if (shooters == null) {
            return (<View styles={InitWindowStyles.rowContainer}><Text style={InitWindowStyles.text}>No Shooters Registered...</Text></View>);
        }

        return Object.keys(shooters).map((key) => {
            return checkFilter(shooters[key], filter) ?
                (<PlayerCard
                    title={shooters[key]["name"]}
                    email={shooters[key]["email"]}
                    onPress={() => { this.onPlayerCardPress(shooters[key], key) }} />)
                : null
        });
    }

    getFilteredData = (sessions, email) => {
        let data = []
        {
            sessions.map((value) => {
                if (value.email === email) {
                    data.push(value)
                }
            })
        }
        return data
    }


    checkFilter = (user, filter) => {
        //console.log(filter.email);
        let result = true;

        if (filter.email && filter.email !== "None" && !user.email.toUpperCase().startsWith(filter.email.toUpperCase(), 0)) {
            result = false
        }

        if (!emails.find(value => value === user.email)) {
            emails.push(user.email);
        }
        else {
            result = false
        }

        return result;
    }


    return (
        <View style={InitWindowStyles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Shooter History</Text>
                    </View>
                </View>
                <View style={InitWindowStyles.filterContainer}>
                    <TextInput label={"Search by Email"} mode={"flat"} style={InitWindowStyles.emailFilter} value={filter.email} onChangeText={(value) => setFilter({
                        shooterName: filter.shooterName,
                        email: value,
                        date: filter.date,
                        sessionType: filter.sessionType,
                    })}></TextInput>
                </View>
                <View style={{ flex: 3, margin: 10 }}>
                    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} style={InitWindowStyles.textInput} onRefresh={this.fetchData} />}>
                        {this.generateShooterList()}
                    </ScrollView>
                </View>
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
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 20
    },
    filterContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 10
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
    },
    emailFilter: {
        color: "white",
        flex: 1,
        textAlign: 'center',
    },
    textInput: {
        flex: 1,
    },
});
