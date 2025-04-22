"use client"
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Correct import
import supaBase from "/lib/supabase";
import { login, logout } from "/lib/auth";

// Login Component
const Login = ({ onSignupClick, onLoginSuccess }) => {
    const [email, setEmail] = useState("jaspalxiv@gmail.com");
    const [password, setPassword] = useState("741852963Js@");

    const handleLogin = async () => {
        const user = await login(email, password);
        if (user) {
            console.log("test login: ", JSON.stringify(user));
            const tmp = { firstName: user.firstName, lastName: user.lastName };
            onLoginSuccess(tmp);
        } else {
            alert("Login Failed: Invalid email or password.");
        }
    };

    return (
        <div className="p-5 bg-gray-900 rounded-lg shadow-md w-[300px] flex flex-col items-center">
            <h2 className="text-xl font-bold text-white mb-2">Login</h2>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border border-gray-600 rounded mb-2 text-white bg-gray-800"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border border-gray-600 rounded mb-2 text-white bg-gray-800"
            />
            
            <button
                className="w-full bg-gray-700 p-2 rounded text-white font-medium mt-2"
                onClick={handleLogin}
            >
                Login
            </button>
            <p className="text-gray-300 mt-2">
                Don&apos;t have an account?{" "}
                <span
                    onClick={onSignupClick}
                    className="text-blue-400 font-bold cursor-pointer"
                >
                    Sign Up
                </span>
            </p>
        </div>
    );
};

// Signup Component
const Signup = ({ onBackToLogin, onLoginSuccess }) => {
    const [firstName, setFirstName] = useState("jasopal");
    const [lastName, setLastName] = useState("singh");
    const [email, setEmail] = useState("jaspalxiv@gmail.com");
    const [password, setPassword] = useState("741852963Js@");

    const handleSignUp = async () => {
        const { data, error: signUpError } = await supaBase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            alert('Sign Up Error: ' + signUpError.message);
            return;
        }

        if (data?.user) {
            const userId = data.user.id;
            console.log(JSON.stringify(data));

            const { data: insertData, error: insertError } = await supaBase
                .from('user_details')
                .insert([
                    {
                        uuid: userId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                    },
                ]);

            if (insertError) {
                console.log(insertError);
                alert('Error: ' + insertError.message);
            } else {
                alert('Data inserted successfully');
                const tmp = { firstName: firstName, lastName: lastName };
                onLoginSuccess(tmp);

            }
        } else {
            alert('Error: User information could not be retrieved.');
        }
    };

    return (
        <div className="p-5 bg-gray-900 rounded-lg shadow-md w-[300px] flex flex-col items-center">
            <h2 className="text-xl font-bold text-white mb-2">Sign Up</h2>
            <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full p-2 border border-gray-600 rounded mb-2 text-white bg-gray-800"
            />
            <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full p-2 border border-gray-600 rounded mb-2 text-white bg-gray-800"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border border-gray-600 rounded mb-2 text-white bg-gray-800"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border border-gray-600 rounded mb-2 text-white bg-gray-800"
            />
            <button
                className="w-full bg-gray-700 p-2 rounded text-white font-medium mt-2"
                onClick={handleSignUp}
            >
                Sign Up
            </button>
            <p className="text-gray-300 mt-2">
                Already have an account?{" "}
                <span
                    onClick={onBackToLogin}
                    className="text-blue-400 font-bold cursor-pointer"
                >
                    Login
                </span>
            </p>
        </div>
    );
};

const Logout = () => {
    const router = useRouter();
    const [timer, setTimer] = useState(3); // 5 second countdown

    useEffect(() => {
        // Perform logout immediately
        logout();
        
        // Set up countdown timer
        const countdown = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    router.push('/'); // Redirect to calculator
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown); // Clean up on unmount
    }, [router]);

    return (
        <div className="p-5 bg-gray-900 rounded-lg shadow-md w-[300px] text-center">
            <h2 className="text-xl font-bold text-white mb-2">Logged Out</h2>
            <p className="text-gray-300">
                Games are now unavailable. You&apos;ll be redirected to the calculator in {timer} seconds.
            </p>
            <div className="mt-4">
                <button 
                    className="text-blue-400 font-medium"
                    onClick={() => router.push('/')}
                >
                    Go now
                </button>
            </div>
        </div>
    );
};



const LandingPage = ({ user, onLogout }) => {
    const router = useRouter();
    const [timer, setTimer] = useState(3);
    const hasRedirected = useRef(false); // Prevent multiple pushes

    useEffect(() => {
        const intervalHandle = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    clearInterval(intervalHandle);
                    if (!hasRedirected.current) {
                        hasRedirected.current = true;
                        setTimeout(() => {
                            router.push("/");
                        }, 0); // Slight delay to escape render phase
                    }
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(intervalHandle);
    }, [router]);

    return (
        <div className="p-5 bg-gray-900 rounded-lg shadow-md w-[300px] flex flex-col items-center text-center space-y-4">
    <h2 className="text-xl font-bold text-white">
        Welcome,<br />
        <span className="text-blue-400">{user.firstName} {user.lastName}</span>
    </h2>
    <p className="text-gray-300">
        Games are now available.<br />
        You’ll be redirected to the calculator in{" "}
        <span className="text-white font-semibold">{timer}</span> seconds.
    </p>
    
</div>

    );
};


// Main AuthPage Component
const AuthPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // Now properly defined
    const [isSignup, setIsSignup] = useState(false);
    const [user, setUser] = useState(null);
    
    // Get logout parameter safely
    const shouldLogout = searchParams?.get('logout') === 'true'; // Optional chaining in case searchParams is null
    
    console.log("shouldLogout:", shouldLogout); // Debugging

    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            {shouldLogout ? (
                <Logout />
            ) : user ? (
                <LandingPage 
                    user={user} 
                    onLogout={() => router.push('/auth?logout=true')} 
                />
            ) : isSignup ? (
                <Signup 
                    onBackToLogin={() => setIsSignup(false)} 
                    onLoginSuccess={setUser} 
                />
            ) : (
                <Login 
                    onSignupClick={() => setIsSignup(true)} 
                    onLoginSuccess={setUser} 
                />
            )}
        </div>
    );
};


export default AuthPage;