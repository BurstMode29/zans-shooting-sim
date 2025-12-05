import React, { useEffect, useContext } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';

import ConfigureTarget from '../screens/ConfigureTarget';
import { AccuracyTarget, ReflexTarget, TimetrialTarget } from '../screens/targets/ActivityTargets';
import ScanQR from '../screens/ScanQR';
import RegisterShooter from '../screens/RegisterShooter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PreviousSessions from '../screens/PreviousSessions';
import ShooterProfile from '../screens/ShooterProfile';
import SessionDetail from '../screens/SessionDetail';
import TopupShots from '../screens/TopupShots';
import PaymentDetails from '../screens/PaymentDetails';
import ContactDetails from '../screens/ContactDetails';
import FirebaseManager from '../services/FirebaseManager';
import GlobalContext from '../components/contexts/GlobalContext';



function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

export const Tab = createMaterialBottomTabNavigator();

export const Stack = createStackNavigator();

export function AuthStack() {
    return (
        <Stack.Navigator initialRouteName='Signup' headerMode='none'>
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen name='ConfigureTarget' component={ConfigureTarget} />
            <Stack.Screen name='ScanQR' component={ScanQR} />
            <Stack.Screen name='RegisterShooter' component={RegisterShooter} />
            <Stack.Screen name='AccuracyTarget' component={AccuracyTarget} />
            <Stack.Screen name='ReflexTarget' component={ReflexTarget} />
            <Stack.Screen name='TimetrialTarget' component={TimetrialTarget} />
            <Stack.Screen name='TopupShots' component={TopupShots} />
            <Stack.Screen name='PaymentDetails' component={PaymentDetails} />
            <Stack.Screen name='ContactDetails' component={ContactDetails} />
        </Stack.Navigator>
    );
}

function SessionHistoryStack() {
    return (
        <Stack.Navigator initialRouteName='PreviousSessions' headerMode='none'>
            <Stack.Screen name='ShooterProfile' component={ShooterProfile} />
            <Stack.Screen name='PreviousSessions' component={PreviousSessions} />
            <Stack.Screen name='SessionDetail' component={SessionDetail} />
        </Stack.Navigator>
    );
}


export default function Footer() {
    const shotContext = useContext(GlobalContext);
    const loadShots = async () => {
        let result = await FirebaseManager.readShots();
        if (result == null) {
            result = 0;
        }
        return result;
    }

    useEffect(() => {
        const instance = FirebaseManager.fbInstance;
        const email = instance.auth().currentUser.email;
        shotContext.setEmail(email);
    }, []);

    useEffect(() => {
        const instance = FirebaseManager.fbInstance;
        const userId = instance.auth().currentUser.uid;
        const onValueChanged = instance.database().ref(`users/${userId}/shots`).on('value', snap => {
            var value = snap.val() ?? 0;
            shotContext.setShots(value);
        });
        return () =>
        instance.database()
          .ref(`users/${userId}/shots`)
          .off('value', onValueChanged);
    }, [FirebaseManager.fbInstance]);

    return (
        <Tab.Navigator
            initialRouteName="Activities"
            tabBarOptions={{
                activeTintColor: '#e91e63',
            }}
            barStyle={{ backgroundColor: 'black' }}
        >
            <Tab.Screen
                name="Modes"
                component={AuthStack}
                options={{

                    tabBarLabel: 'Modes',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="target" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Records"
                component={SessionHistoryStack}
                options={{
                    tabBarLabel: 'Records',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Users"
                component={RegisterShooter}
                options={{
                    tabBarLabel: 'Add Shooter',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-multiple-plus" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}