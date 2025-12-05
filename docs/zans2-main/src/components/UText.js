import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UText(props) {
    const [textWidth, setTextWidth] = useState(0);
    return (
        <View style={styles.container}>
            <Text onLayout={(e) => {
                var layout = e.nativeEvent.layout;
                setTextWidth(layout.width);
            }} style={props.textStyle}>
                {props.children}
                
            </Text>
            <View style={[styles.divider, {width: textWidth}]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    divider: {
        height: 2,
        backgroundColor: "red",
    },
})