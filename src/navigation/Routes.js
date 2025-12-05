import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/LoginScreen';
import { View, Text } from 'react-native'
import AuthStack from './AuthStack';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from '@react-navigation/stack';
import RegisterShooter from '../screens/RegisterShooter';
import SignupEmailScreen from '../screens/SignupEmailScreen'
import GlobalContext from '../components/contexts/GlobalContext';

const Stack = createStackNavigator();

function LoginStack() {
    return (
        <Stack.Navigator initialRouteName="Login" headerMode='' >
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='EmailSignup' component={SignupEmailScreen} />
            <Stack.Screen name='Home' component={HomeStack} />
        </Stack.Navigator>
    );
}



export const navigationRef = React.createRef();

export const rootNavigationRef = React.createRef();

export function rootGoBack() {
    rootNavigationRef.current?.goBack();
}

export function navigate({ name, params}) {
    if (navigationRef.current) {
        navigationRef.current?.navigate({name: name});
    }
}

export function goBack() {
    var canGoBack = navigationRef.current?.canGoBack();
    if (canGoBack) {
        navigationRef.current?.goBack();
    } 
    else {
        rootGoBack();
    }
}

export function goToStart() {
    navigationRef.current?.popToTop();
}

export function HomeStack() {
    const [shots, setShots] = useState(0);
    const [email, setEmail] = useState("Your email address");
    const [shooters, setShooters] = useState({});
    const [currentPage, setCurrentPage] = useState("Activities");
    const shotsProvider = {
        shots, setShots,
        shooters, setShooters,
        currentPage, setCurrentPage,
        email, setEmail,
    };

    return (
        <GlobalContext.Provider value={shotsProvider}>
            <NavigationContainer independent={true} ref={navigationRef}>
                <Header />
                <Footer />
            </NavigationContainer>
        </GlobalContext.Provider>
    );
}

export default function Routes() {
    return (

        <NavigationContainer ref={rootNavigationRef}>
            <LoginStack />
        </NavigationContainer>

    );
}