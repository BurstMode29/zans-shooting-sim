import React, { useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, } from 'react-native';
import Activity from '../components/Activity';
import GlobalContext from '../components/contexts/GlobalContext'
import { initialiseIAP } from '../services/PaymentManager'

import bgImg from '../../assets/images/bg-blur.jpg';

export default function SignupScreen({ navigation }) {
    const _onProgramSelect = (type) => {
        navigation.navigate('ConfigureTarget', { type })
    }

    let globalContext = useContext(GlobalContext);

    globalContext.setCurrentPage("Activities")

    useEffect(() => {
        var purchaseCb;
        initialiseIAP(purchaseCb);
        return (() => {
            if (purchaseCb) {
                purchaseCb.remove();
                purchaseCb = null;
            }
        })
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.activityContainer} style={{ flex: 1 }}>
                    <Activity title="Accuracy"
                        description="Group shots as closely as possible to each other for the best possible score."
                        image={require('../../assets/images/accuracy.png')}
                        icon="bullseye"
                        onPress={() => _onProgramSelect('accuracy')}
                        style={styles.activity}
                    />

                    <Activity title="Time Trial"
                        description="Hit the center of the target as many times as you can within the time period."
                        image={require('../../assets/images/timetrial.png')}
                        icon="alarm"
                        onPress={() => _onProgramSelect('timetrial')}
                        style={styles.activity}
                    />


                    <Activity title="Reflexes"
                        description="React as quickly as possible to shooting prompts"
                        image={require('../../assets/images/reflexes.png')}
                        icon="lightning-bolt-outline"
                        onPress={() => _onProgramSelect('reflexes')}
                        style={styles.activity}
                    />


                </ScrollView>
            </ImageBackground>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        margin: 5
    },
    activity: {
        borderRadius: 5,
        backgroundColor: "#1f1f1f",
        padding: 15,
        margin: 15,
    },
    activityContainer: {
        justifyContent: "space-around",
        flexGrow: 1,
    },
    card: { margin: 5 }
});
