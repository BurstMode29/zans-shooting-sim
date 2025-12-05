import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Firebase from '../providers/FirebaseProvider'
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-community/google-signin';

// Configure Google Sign-In once when the module loads
GoogleSignin.configure({
    webClientId: Config.GOOGLESIGNIN_WEBCLIENTID
});

export async function GoogleSignIn() {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
    return Firebase.auth().signInWithCredential(googleCredential);
};

FacebookSignIn = async () => {

};

TwitterSignIn = async () => {

};

AppleSignIn = async () => {

};
