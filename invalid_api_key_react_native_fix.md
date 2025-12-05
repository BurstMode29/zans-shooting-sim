# Firebase `auth/invalid-api-key` — Root Cause Analysis & Fix Guide (React Native)

This document explains why the **`auth/invalid-api-key`** error appears in your React Native app and provides a full checklist + fixes to resolve it.

---

# 📌 1. What This Error Means
The error:
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```
occurs when the Firebase SDK detects that the **API key bundled in the app is NOT valid for the Firebase project it's trying to access**.

This means:
- The API key inside the APK is **wrong**, OR
- Firebase is being initialized with **incorrect config**, OR
- The `google-services.json` used during the build is **not the correct one**, OR
- The app is using **manual Firebase initialization** instead of the config file.

This is a **React Native–specific issue**, and the root cause is almost always a mismatch between:

### **➡️ The API key inside the APK**
**VS**
### **➡️ The API key inside Firebase Console > Project Settings**

---

# 📌 2. Common Causes in React Native
Below are the React Native–specific culprits.

## **2.1 Missing or incorrect `google-services.json`**
Even if the file exists:
- It may be from the wrong Firebase project
- It may belong to a different app (different package name)
- The developer may not have rebuilt with the latest one


## **2.2 Manual Firebase initialization overriding google-services.json**
React Native Firebase **should not** use manual config:

❌ Incorrect:
```js
firebase.initializeApp({
  apiKey: "HARDCODED_KEY",
  authDomain: "example.firebaseapp.com",
});
```
This causes conflicts and invalid key errors.

Correct React Native Firebase does **not** need this; the SDK reads from native config.


## **2.3 Wrong SHA keys in Firebase Console**
This is extremely common.

Firebase requires:
- **SHA1**
- **SHA256**

If these do not match the **release keystore**, Firebase rejects login attempts.


## **2.4 Release build using a different config than debug**
Debug may work, but release fails if:
- Release keystore SHA1 not added
- google-services.json copied only to `debug` folder
- Or release not using the file

---

# 📌 3. Developer Fixes — CHECKLIST
Send this list to your developer.

## ✅ **Step 1 — Verify `google-services.json` is correct**
It must match:
- The same package name used in your app
- The SHA keys of the signing keystore

Correct location:
```
android/app/google-services.json
```
NOT in:
- `/android/` (wrong)
- `/src` (wrong)
- `/main` (wrong)

---

## ✅ **Step 2 — Add SHA Keys (Most Important)**
In Firebase Console:
```
Project Settings → Your Apps → Android App → Add Fingerprints
```
Add BOTH:
- SHA1
- SHA256

From the **release keystore**, not debug.

Command:
```
keytool -list -v -keystore your-release-keystore.keystore -alias your_alias -storepass PASSWORD
```

Download the NEW google-services.json after adding keys.

Rebuild the APK.

---

## ✅ **Step 3 — Remove manual initialization in JS**
If you see:
```js
firebase.initializeApp()
```
Remove it.

React Native Firebase automatically initializes using native config files.

Manual initialization = wrong API key = invalid-api-key.

---

## ✅ **Step 4 — Confirm Native Build Setup**
### In `android/build.gradle`:
You must have:
```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

### In `android/app/build.gradle`:
End of file:
```gradle
apply plugin: 'com.google.gms.google-services'
```

If missing → firebase config **does not load**.

---

# 📌 4. Handling Email/Password Test Accounts
To create a test account:
1. Firebase Console → Authentication → Users → **Add User**
2. Enter email + password
3. These credentials can now be used in the app

If you see `auth/invalid-api-key`, Firebase will reject ALL login types:
- Email/password
- Google Sign-In
- Phone auth

Fixing the API key issue will fix all login methods.

---

# 📌 5. Confirming the Fix Worked
Once corrected, your app should:
- Allow email/password signup without errors
- Google Sign-In should redirect to the home screen
- `firebase.auth().currentUser` should no longer be null

Use **Android Studio Logcat** to verify:
```
I/FirebaseAuth: Token fetch succeeded
I/FirebaseApp: Initialization successful
```

No more:
```
E/FirebaseAuth: Client does not have permission to access the Firebase project
E/Auth: invalid-api-key
```

---

# 📌 6. If the Issue Remains
Your developer should check:
- App has multiple `google-services.json` files
- Wrong environment gets bundled (e.g., staging vs production)
- Metro bundler cache
- Gradle cache

Reset caches:
```
cd android
./gradlew clean
```
Then rebuild:
```
npx react-native run-android --variant=release
```

---

# 📌 7. Summary
The `auth/invalid-api-key` error in React Native means:
- The API key in the APK does not match the Firebase project.

Fix requires:
- Correct SHA keys
- Correct google-services.json
- No manual JS initialization
- Correct Gradle setup

Once corrected, all login methods will work.

---

If you want, I can now:
✅ Extract API key from your APK
✅ Check if the app is manually initializing Firebase
✅ Decode manifest to confirm package and providers

Just tell me: **"Analyze the new APK deeply"**.

