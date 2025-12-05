import { Container } from 'unstated'
import Config from 'react-native-config'
import Firebase from '../providers/FirebaseProvider';
import { AutoId } from '../utils/FirebaseAutoId';

class FirebaseManager extends Container {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
        this.fbInstance = Firebase;
        this.signedInFunc = null
        
    }

    init(cb) {
        this.signedInFunc = cb
        this.fbInstance = Firebase;
        this.bindAuthListener()
    }

    bindAuthListener = () => {
        this.fbInstance.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                this.setState({ user }, () => {
                   console.log("user sign in detected")
                    this.signedInFunc()
                })
            } else {
                console.log("No user found")
            }
        });
    }
    getAuth = () => {
        return this.fbInstance.auth();
    }
    getInstance = () => {
        return this.fbInstance;
    }

    doSignUp = async (email = '', password = '') => {
        return this.fbInstance.auth().createUserWithEmailAndPassword(email, password)
    }

    dologin = (email = '', password = '') => {
        return this.fbInstance.auth().signInWithEmailAndPassword(email, password)
    }

    signOut = () => {
        return this.fbInstance.auth().signOut()
    }

    writeShooter = (data) => {
        let userId = this.fbInstance.auth().currentUser.uid;
        let shooterId = AutoId();

        return this.fbInstance.database().ref(`users/${userId}/shooters/${shooterId}`).set(data)
            .then((success) => {
                return {
                    "status": "Success",
                    "message": "Successfully added new shooter",
                    "shooterId": shooterId
                }
            })
            .catch((error) => {
                return {
                    "status": "Failed",
                    "message": "Failed to add new shooter"
                }
            });
    }

    readShooters = async () => {
        let userId = this.fbInstance.auth().currentUser.uid;
        return this.fbInstance.database().ref(`users/${userId}/shooters`).once('value').then((data) => {
            console.log(data);
            return data.val()
        });
    }

    writeSession = (data) => {
        let userId = this.fbInstance.auth().currentUser.uid;
        let currentDate = data.date;
        return this.fbInstance.database().ref(`users/${userId}/sessions/${currentDate}`).set(data);
    }

    readSessions = async () => {
        let userId = this.fbInstance.auth().currentUser.uid;
        return this.fbInstance.database().ref(`users/${userId}/sessions`).once('value').then((data) => {
            return data.val()
        });
    }

    readShots = async () => {
        let userId = this.fbInstance.auth().currentUser.uid;
        return this.fbInstance.database().ref(`users/${userId}/shots`).once('value').then((data) => {
            return data.val()
        });
    }

    onShotsUpdate = async () => {
        let userId = this.fbInstance.auth().currentUser.uid;
        return this.fbInstance.database().ref(`users/${userId}/shots`).on('value', snap => snap.val());
    }

    updateShots = (data) => {
        let userId = this.fbInstance.auth().currentUser.uid;
        this.fbInstance.database().ref(`users/${userId}/shots`).set(data);
    }


}

export default new FirebaseManager