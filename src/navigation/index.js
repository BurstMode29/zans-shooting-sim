import React from 'react';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import Routes from './Routes';

/**
 * Wrap all providers here
 */

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#F2F2F2',
        accent: '#F25757',
    },
};

export default function Providers() {
    return (
        <PaperProvider theme={theme}>
            <Routes />
        </PaperProvider>
    );
}