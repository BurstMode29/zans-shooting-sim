# Firebase API Key Issue Analysis and Resolution Attempts

## Problem Statement
The ZansModern React Native app experiences two main issues:
1. App crashes on startup
2. When it doesn't crash, users get `FirebaseError: Firebase: Error (auth/invalid-api-key)` when attempting to sign up or use Google Sign-In

## Initial Configuration Review
- `google-services.json` in `android/app/` directory contains correct project configuration
- Firebase project: `zans-shooting-sim`
- API Key: `AIzaSyC9J2GtoBFUzhzoMra4Iee31pfJDz46l2A`
- Web Client ID: `431457647270-ibv6cm2mal6b3f4nmi3vvtiko5q1b840.apps.googleusercontent.com`
- Package name: `com.zansmodern`

## Initial Firebase Configuration Issues Identified

### 1. FirebaseProvider.js - Duplicate Initialization
- Issue: Manual Firebase initialization conflicting with native initialization
- Original problem: Firebase was being initialized both by native layer (google-services.json) and in JavaScript

### 2. FirebaseSocialAuth.js - Multiple Configurations
- Issue: Google Sign-In was being configured on every sign-in attempt
- Problem: Configuration should happen once at app start, not on each sign-in

### 3. FirebaseManager.js - Double Initialization
- Issue: Attempting to reconfigure Firebase with same config that was already applied

## Resolution Attempts

### Attempt 1: Remove Manual Configuration
**Files Modified:**
- `FirebaseProvider.js`

**Changes:**
- Removed explicit config object from `initializeApp()`
- Used `firebase.initializeApp()` instead of `firebase.initializeApp(config)`

**Result:** App still crashed on startup

### Attempt 2: Proper Initialization Check
**Files Modified:**
- `FirebaseProvider.js`

**Changes:**
- Added check: `if (firebase.apps.length === 0)`
- Initialize only if no apps exist, otherwise use `firebase.app()`

**Result:** App still crashed on startup

### Attempt 3: Configuration with Environment Variables
**Files Modified:**
- `FirebaseProvider.js`

**Changes:**
- Reverted to using config from environment variables
- Still with proper initialization check

**Result:** App crashed on startup

### Attempt 4: Simplified Initialization
**Files Modified:**
- `FirebaseProvider.js`

**Changes:**
- Used only `firebase.app()` to get the existing initialized app
- Removed all initialization logic

**Result:** App would start but Firebase API error persisted

### Attempt 5: Google Sign-In Configuration Timing
**Files Modified:**
- `FirebaseSocialAuth.js`

**Changes:**
- Moved `GoogleSignin.configure()` from function to module level
- Configuration now happens once when module loads

**Result:** App started but Firebase API error still occurred

### Attempt 6: Proper Firebase Initialization Check
**Files Modified:**
- `FirebaseProvider.js`

**Changes:**
- Combined initialization check with native configuration
- `if (firebase.apps.length === 0) firebase.initializeApp() else firebase.app()`

**Result:** Current state - app should work but may still have issues

### Attempt 7: Cleanup FirebaseManager Initialization
**Files Modified:**
- `FirebaseManager.js`

**Changes:**
- Removed manual configuration in `init()` method
- Ensured it only references the Firebase instance from FirebaseProvider

**Result:** Should prevent duplicate initialization errors

## Current State Analysis

### Working Components:
- Google Services Gradle plugin properly configured
- `google-services.json` file properly placed
- Environment variables in `.env` file correctly set
- Android build process works

### Remaining Issues:
- There may be a timing issue where Firebase isn't ready when auth methods are called
- react-native-config might not be working properly in release builds
- There could be an issue with the Firebase SDK versions or compatibility

## Additional Considerations

### Potential React Native Config Issues:
- `react-native-config` requires native rebuild to pick up changes
- May not work properly in release builds if not configured correctly

### Firebase SDK Version Compatibility:
- Using Firebase v10.14.1 with compat libraries
- May need to use different initialization patterns

### Possible Solutions to Try:
1. Ensure react-native-config is properly linked
2. Consider using Firebase's automatic config from native layer only
3. Add error handling and logging to determine exact crash point
4. Verify that all Firebase services are properly linked in Android

## Build Process Notes
- Clean builds required after changing Firebase configuration
- Gradle daemon issues can sometimes cause build failures
- Release builds may behave differently than debug builds due to minification