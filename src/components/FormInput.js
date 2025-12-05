import React from 'react';
import { StyleSheet,} from 'react-native';
import { TextInput } from 'react-native-paper';

export default function FormInput({ labelName, ...rest }) {
    return (
        <TextInput
            label={labelName}
            style={styles.input}
            numberOfLines={1}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginBottom: 10
    }
});