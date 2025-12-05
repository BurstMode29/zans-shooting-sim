import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { scale, moderateScale, } from 'react-native-size-matters';

import UText from './UText.js';


export default function Activity({ title, description, image, icon, onPress, ...rest }) {
    useEffect(() => {
    }, []);
    return (
        <Pressable onPress={onPress} {...rest}>
        <View style={styles.cardMaterial} >
                <View style={styles.titleBar} >
                    <View style={{ padding: 6 }}>
                        <Avatar.Icon size={scale(30)} icon={icon} />
                    </View>
                    <UText textStyle={styles.titleText}>{title}</UText>
                    <View style={{flex: 2}}/>
                </View>

                <View>
                    <Text style={styles.paragraph}>
                        {description}
                    </Text>
                </View>
        </View>
        </Pressable>

    );
}

const styles = StyleSheet.create({
    card: { margin: 5 },
    cardMaterial: {
        

    },
    cardContent: {},
    titleBar: {
        flexDirection: "row",
        alignItems: "center"
    },
    titleIcon: {
        alignSelf: "center",
        padding: 8,
    },
    titleContainer: {
    },
    titleText: {
        padding: 6,
        color: "white",
        fontSize: moderateScale(20),
    },
    paragraph: {
        fontSize: moderateScale(16),
        padding: 10,
        color: "white",
    },
});