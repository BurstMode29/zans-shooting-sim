import React, { useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { scale } from 'react-native-size-matters';
import GlobalContext from '../components/contexts/GlobalContext.js';

import bgImg from '../../assets/images/bg-blur.jpg';

export default function PaymentDetails({ navigation }) {

    const globalContext = useContext(GlobalContext);

    function RowEntry({ title, value }) {
        return (
            <View style={styles.rowContainer}>
                <Text style={styles.text}>{title}</Text>
                <Text style={styles.text}>{value}</Text>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <ImageBackground source={bgImg} style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1f1f1f", alignItems: "center", padding: 8 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: scale(20), margin: 4 }}>Payment Details</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.payContainer}>
                        <RowEntry title={"Bank"} value={"FNB"} />
                        <RowEntry title={"Account Type"} value={"BUSINESS CHEQUE ACCOUNT"} />
                        <RowEntry title={"Account Number"} value={"62878260919"} />
                        <RowEntry title={"Branch Name"} value={"RONDEBOSCH"} />
                        <RowEntry title={"Branch Code"} value={"250655"} />
                        <RowEntry title={"Swift Code"} value={"FIRNZAJJ"} />
                        <RowEntry title={"Reference"} value={globalContext.email} />
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
    bottomContainer: {
        justifyContent: "space-evenly",
        margin: 12,
        flex: 1
    },
    container: {
        flex: 2
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
    text: {
        flex: 1,
        fontSize: scale(12),
        color: "white",
    },
});
