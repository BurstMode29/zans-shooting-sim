import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import ConfigureTarget from '../screens/ConfigureTarget';
import ScanQR from '../screens/ScanQR';
import RegisterShooter from '../screens/RegisterShooter';
import AccuracyTarget from '../screens/targets/AccuracyTarget';

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator initialRouteName='Login' headerMode='none'>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen name='RegisterShooter' component={RegisterShooter} />
            <Stack.Screen name='ConfigureTarget' component={ConfigureTarget} />
            <Stack.Screen name='ScanQR' component={ScanQR} />
            <Stack.Screen name='AccuracyTarget' component={AccuracyTarget} />
        </Stack.Navigator>
    );
}