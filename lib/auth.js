import supaBase from "/lib/supabase";

// Auth Functions (unchanged)
async function checkUser() {
    const { data, error } = await supaBase.auth.getUser();

    if (error) {
        console.log("Error:", error.message);
        return false;
    } else {
        console.log("Authenticated user:", data);
        return true;
    }
}

async function login(email, password) {
    const { data, error } = await supaBase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log("Error during sign-in:", error.message);
        alert('Sign In Error: ' + error.message);
        return null;
    } else {
        console.log("User signed in:", data);
    }

    if (await checkUser() == true) {
        const { data, error: signUpError } = await supaBase.from("user_details").select("").single();
        if (signUpError) {
            console.log("Error:", signUpError.message);
            return null;
        }
        console.log("Logged in select from table: " + JSON.stringify(data));
        return data;
    }
    return null;
}

async function logout() {
    const { data, error } = await supaBase.auth.signOut();
    if (error) {
        console.log("Error during sign-out:", error.message);
        return false;
        } else {
            console.log("User signed out:", data);
            return true;
            }
    
}

exports.login = login;
exports.checkUser = checkUser;
exports.logout = logout;