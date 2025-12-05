import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Linking, Pressable } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import { moderateScale, scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';
import Mailer from 'react-native-mail';
import { paymentRequest, getIapProducts, ZANSPRODUCTS } from '../services/PaymentManager.js';

import bgImg from '../../assets/images/bg-blur.jpg';

export default function TopupShots({ navigation }) {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState("");
    const email = "admin@shootingsimulator.co.za";
    const sms = "083 578 6683";
    useEffect(() => {
        async function fetchData() {
            getIapProducts(Object.keys(ZANSPRODUCTS)).then((result) => {
                if (result.length > 0) {
                    console.log(result);
                    setProducts(result);
                    setSelected(result[0].productId);
                } else {
                    Snackbar.show({
                        text: "No products found",
                        duration: Snackbar.LENGTH_LONG
                    });
                }
            }).catch((error) => {
                console.log(error)
                Snackbar.show({
                    text: "Network error",
                    duration: Snackbar.LENGTH_LONG
                });
            });
        }
        fetchData();
    }, []);

    function ProductRadioGroup({ items }) {
        if (items == null || items.length == 0) {
            return (
                <View style={styles.radioTab}>
                    <Text style={styles.text}>None</Text>
                    <RadioButton
                        value=""
                        status="checked"
                        onPress={() => { }}
                    />
                </View>
            );
        }

        return (
            <ScrollView style={{ flex: 1 }}>
                {
                    items.map((p) => {
                        return (
                            <Pressable onPress={() => { setSelected(p.productId) }}>
                                <View style={styles.radioTab}>
                                    <Text style={styles.text}>{`${p.localizedPrice} \t-\t${p.description}`}</Text>
                                    <RadioButton
                                        value={p.productId}
                                        status={selected == p.productId ? "checked" : "unchecked"}
                                        onPress={() => { setSelected(p.productId) }}
                                    />
                                </View>
                            </Pressable>
                        )
                    })
                }
            </ScrollView>
        );
    }

    async function handlePayment(sku) {
        if (!Object.keys(ZANSPRODUCTS).includes(sku)) {
            Snackbar.show({
                text: "No item selected",
                duration: Snackbar.LENGTH_LONG,
            })
            return;
        }
        try {
            await paymentRequest(sku);
        } catch (error) {
            console.log(`Payment request error: ${error}`);
        }
    }

    function emailPress() {
        Mailer.mail({
            subject: "Proof of Purchase",
            recipients: [email]
        }, (error, event) => { console.log(error) });
    }

    function smsPress() {
        Linking.openURL("sms:" + sms);
    }

    return (
        <View style={styles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Top up Shots</Text>
                    </View>
                </View>
                <View style={styles.topContainer}>
                    <View style={styles.textBlock}>
                        <Text style={styles.text}>Please select one of the package options below then select a payment option</Text>
                        <Text style={styles.text}>If purchasing by EFT, please send proof of payment to <Text style={styles.clickableText} onPress={emailPress}>{email}</Text> or SMS to <Text style={styles.clickableText} onPress={smsPress}>{sms}</Text> </Text>
                    </View>
                    <View style={{ margin: 12 }} />

                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.text}>Choose Amount</Text>
                    <ProductRadioGroup items={products} />

                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ flex: 1 }}>
                        <Button mode={"contained"} onPress={() => handlePayment(selected)} style={styles.button}>Pay by Card</Button>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button mode={"contained"} onPress={() => navigation.navigate("PaymentDetails")} style={styles.button}>Pay by EFT</Button>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    payContainer: {
        flex: 1,
        margin: 30
    },
    textInput: {
        flex: 1,
    },
    textBlock: {
        flex: 1,
    },
    topContainer: {
        margin: 24,
        flex: 1
    },
    bottomContainer: {
        margin: 24,
        flex: 4
    },
    container: {
        justifyContent: "flex-start",
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
    text: {
        fontSize: moderateScale(12),
        color: "white",
    },
    clickableText: {
        fontSize: moderateScale(12),
        color: "#ff1f1f",
    },
    buttonContainer: {
        flexDirection: "row"
    },
    radioTab: {
        paddingTop: 12,
        paddingBottom: 12, 
        justifyContent: "space-between", 
        flexDirection: "row"
    }
});