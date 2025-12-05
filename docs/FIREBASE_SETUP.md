# Firebase Configuration Guide for ZansModern App

## Overview

This document outlines the Firebase configuration process for the ZansModern React Native application. It details how to properly set up Firebase services to avoid common initialization errors.

## Problem Statement

The original APK was missing the required `google-services.json` file, causing Firebase services to fail during runtime. This resulted in authentication failures and other Firebase-dependent features not working correctly.

## Configuration Requirements

### 1. Android Setup

The application requires the following files and configurations:

- `android/app/google-services.json` - Firebase project configuration file
- `android/build.gradle` - Must include:
  ```
  classpath 'com.google.gms:google-services:4.3.15'
  ```
- `android/app/build.gradle` - Must apply:
  ```
  apply plugin: 'com.google.gms.google-services'
  ```

### 2. Environment Variables (.env)

The following Firebase configuration values are required in the `.env` file:

```
FIREBASE_APIKEY=[Your Firebase API Key]
FIREBASE_AUTHDOMAIN=[Your Auth Domain]
FIREBASE_DBURL=[Your Database URL]
FIREBASE_PROJECTID=[Your Project ID]
FIREBASE_STORAGEBUCKET=[Your Storage Bucket]
FIREBASE_SENDERID=[Your Sender ID]
GOOGLESIGNIN_WEBCLIENTID=[Your Google Sign-In Web Client ID]
```

## Setup Process

### Step 1: Create Firebase Project
1. Create a new Firebase project at https://console.firebase.google.com/
2. Register your Android app with package name `com.zansmodern`
3. Download the `google-services.json` file

### Step 2: Enable Authentication Services
1. Go to Firebase Console > Authentication
2. Enable required sign-in methods (Email/Password, Google)
3. Download the updated `google-services.json` file

### Step 3: Update Environment Variables
1. Update the `.env` file with new Firebase configuration values
2. Ensure the Google Sign-In web client ID matches your Firebase project

### Step 4: Place Configuration Files
1. Place `google-services.json` in `android/app/` directory
2. Verify all environment variables are properly set in `.env`

## Implementation Details

### Firebase Initialization

The app uses `FirebaseProvider.js` to initialize Firebase with environment variables:

```javascript
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import Config from 'react-native-config';

const config = {
    apiKey: Config.FIREBASE_APIKEY,
    authDomain: Config.FIREBASE_AUTHDOMAIN,
    databaseURL: Config.FIREBASE_DBURL,
    projectId: Config.FIREBASE_PROJECTID,
    storageBucket: Config.FIREBASE_STORAGEBUCKET,
    messagingSenderId: Config.FIREBASE_SENDERID
}

const Firebase = firebase.initializeApp(config);
```

### Google Sign-In Configuration

Google Sign-In is handled in `FirebaseSocialAuth.js`:

```javascript
GoogleSignin.configure({ webClientId: Config.GOOGLESIGNIN_WEBCLIENTID })
```

## Verification Steps

To verify the Firebase configuration is working:

1. Build the application successfully
2. Check that Firebase services initialize without errors
3. Test authentication flows (sign-in, sign-out)
4. Verify Firestore and Storage access (if applicable)

## Troubleshooting

### Common Issues:
- "Firebase API error: missing or invalid API key": Check that .env values are properly loaded
- "Default FirebaseApp is not initialized": Verify google-services.json is in the correct location
- Google Sign-In fails: Ensure the web client ID matches your Firebase project

### Environment Variables Not Loading:
- Make sure react-native-config is properly linked
- Clean and rebuild the application after .env changes
- Verify the .env file permissions and location

## Notes

- The `google-services.json` file contains sensitive project information and should not be committed to public repositories
- Always use different Firebase projects for development and production
- Remember to update SHA certificates in Firebase Console for different build variants