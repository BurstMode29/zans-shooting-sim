import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, } from 'react-native';
import { Appbar, Menu, Divider, Button, Title, Subheading } from 'react-native-paper';
import { goBack, navigate, rootGoBack } from '../navigation/Routes';
import GlobalContext from '../components/contexts/GlobalContext';
import FirebaseManager from '../services/FirebaseManager';
import logo from '../../assets/images/logo.png'
import { scale, moderateScale } from 'react-native-size-matters';

import { Button as RNButton } from 'react-native';


function Header() {
    const [visible, setVisible] = useState(false);

    const closeMenu = () => setVisible(false);
    const openMenu = () => setVisible(true);
    const shotContext = useContext(GlobalContext);
    return (
        <Appbar.Header style={{ backgroundColor: 'black', height: moderateScale(60) }}>
            <Appbar.BackAction onPress={goBack} />
            <View style={styles.headerContainer}>
                <View style={styles.imageContainer}>
                    <Image source={logo} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Title style={[styles.text, { fontSize: scale(12) }]}>{shotContext.shots}</Title>
                    <Subheading style={styles.text}>Shots left</Subheading>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ flex: 0.6 }} />
                    <View style={styles.buyButton}>
                        <RNButton
                            onPress={() => navigate({ name: "TopupShots" })}
                            title={"Buy Shots"}
                            style={styles.button}
                            color={"black"}

                        />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
            </View>


            <Menu
                onDismiss={closeMenu}
                visible={visible}

                anchor={<Button icon={"menu"} onPress={openMenu} style={{ width: 10 }} />}
            >

                <Menu.Item title={`Signed in as ${FirebaseManager.getAuth().currentUser.email}`} />
                <Divider />

                <Menu.Item
                    title={"Contact Details"}
                    onPress={() => navigate({ name: "ContactDetails" })}
                />
                <Menu.Item onPress={() => {
                    FirebaseManager.getAuth().signOut();
                    rootGoBack();
                }}
                    title="Sign Out" />
            </Menu>

        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        flex: 1,
    },
    imageContainer: {
        flex: 0.9,

    },
    image: {
        flex: 1,
        height: scale(50),
        width: scale(50),
        resizeMode: 'contain',
    },
    text: {
        flex: 1,
        fontSize: scale(10),
        color: "white",
    },
    textContainer: {
        flex: 0.6,
        alignContent: "center",
    },
    buttonContainer: {
        flex: 1.5,
        width: "100%",
        padding: 10

    },
    buyButton: {
        padding: 1,
        backgroundColor: "white",
        borderRadius: 2,
        justifyContent: "center",
    },
    button: {
        flex: 1,
    }
});

export default Header;