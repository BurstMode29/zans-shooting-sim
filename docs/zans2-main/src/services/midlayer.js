import FirebaseManager from './FirebaseManager'

export async function login(email = "", password = "") {
    try {
        await FirebaseManager.dologin(email, password)
        console.log("Login success");
        return {
            success: true,
            message: "User Logged in"
        }
    } catch (err) {
        console.log("Login failure" + err);
        return {
            success: false,
            message: err.toString()
        }
    }
}

export async function register(email = "", password = "") {
    try {
        await FirebaseManager.doSignUp(email, password)
        console.log("Register success");
        return {
            success: true,
            message: "User account created"
        }
    } catch (err) {
        console.log("Register failure");
        return {
            success: false,
            message: err.toString()
        }
    }
}

export async function logout() {
    try {
        await FirebaseManager.signOut()
        console.log("Signout success");
        return {
            success: true,
            message: "User signed out"
        }
    } catch (err) {
        console.log("Sign out failure");
        console.log(err)
        return {
            success: false,
            message: err.toString()
        }
    }
}

