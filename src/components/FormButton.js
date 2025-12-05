import React from 'react';
import { StyleSheet,} from 'react-native';
import { Button } from 'react-native-paper';

export default function FormButton({ title, icon, modeValue, ...rest }) {
    return (
        <Button
            mode={modeValue}
            {...rest}
            icon={icon}
            style={styles.button}
            contentStyle={styles.buttonContainer}
        >
            {title}
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10
    }
});