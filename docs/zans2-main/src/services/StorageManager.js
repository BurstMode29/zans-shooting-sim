
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function StoreData(key, value) {
    try {
        return await AsyncStorage.setItem(key, ToJSON(value));
    } catch (e) {
        console.log("Failed to store");
    }
}

export async function ReadData(key) {
    try {
        var result = await AsyncStorage.getItem(key);
        return FromJSON(result)
    } catch (e) {
        return null;
    }
}

function ToJSON(value) {
    return JSON.stringify(value);
}

function FromJSON(value) {
    return JSON.parse(value);
}