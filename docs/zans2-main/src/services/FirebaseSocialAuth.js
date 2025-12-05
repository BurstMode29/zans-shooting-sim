import firebase from 'firebase';
import Firebase from '../providers/FirebaseProvider'
import Config from 'react-native-config';

import { GoogleSignin } from '@react-native-community/google-signin';


export async function GoogleSignIn() {
    GoogleSignin.configure({ webClientId: Config.GOOGLESIGNIN_WEBCLIENTID })
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
