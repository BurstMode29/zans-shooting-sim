import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

// Properly handle Firebase initialization for React Native
// Initialize only if no apps exist yet, otherwise get the default app
let Firebase;
if (firebase.apps.length === 0) {
  // This will use the configuration from google-services.json automatically
  Firebase = firebase.initializeApp();
} else {
  // If already initialized by native layer, just get the default app
  Firebase = firebase.app();
}

export default Firebase;