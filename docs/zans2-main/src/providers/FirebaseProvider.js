import FirebaseManager from '../services/FirebaseManager';
import * as firebase from 'firebase';
import Config from 'react-native-config';

const config = {
    apiKey: Config.FIREBASE_APIKEY,
    authDomain: Config.FIREBASE_AUTHDOMAIN,
    databaseURL: Config.FIREBASE_DBURL,
    projectId: Config.FIREBASE_PROJECTID,
    storageBucket: Config.FIREBASE_STORAGEBUCKET,
    messagingSenderId: Config.FIREBASE_SENDERID
}

const Firebase = firebase.default.initializeApp(config);
export default Firebase;