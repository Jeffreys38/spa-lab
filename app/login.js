import React, {useEffect, useState} from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView, TouchableOpacity,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {router, useNavigation} from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';

import {handleError} from "../src/handler/error";
import {AppDispatch, RootState} from "../src/store";
import {login, loginWithGithub, loginWithGoogle} from "../src/store/slices/authSlice";
import AppHelper from "../src/helpers/AppHelper";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const dispatch: AppDispatch = useDispatch();
    const {loading, error, user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user) {
            if (user.role === null) {
                router.replace('/get-started');
            } else {
                router.replace('/');
            }
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            if (isInputEmpty()) {
                return;
            }

            await dispatch(login(email, password));
        } catch (error) {
            alert(handleError({
                code: error.code,
                message: error.message
            }));
        }
    };

    function isInputEmpty() {
        if (email.trim() === "" || password.trim() === "") {
            alert("Cannot be left blank");
            return true;
        }
        return false;
    }

    const handleWithGoogle = async () => {
        try {
            await dispatch(loginWithGoogle());
        } catch (e) {
            AppHelper.showJson(e, "error");

            alert(handleError({
                code: error.code,
                message: error.message
            }));
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={{width: 250, height: 250, resizeMode: 'contain'}}
                    source={require("../assets/images/logo.png")}
                />
                <Text style={styles.screenTitle}>Borcelle Salon & Spa</Text>
                <Text style={styles.screenSubTitle}>Your Oasis of Relaxation</Text>
            </View>

            {/* Wrapping each TextInput inside a View */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={[styles.signupText, styles.btn]}>{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
                Don't have an account?{" "}
                <Text
                    onPress={() => navigation.navigate("signup")}
                    style={styles.signupLink}
                >
                    Sign Up
                </Text>
            </Text>
            <Text style={styles.signupText}>
                <Text
                    onPress={() => router.push("forgot")}
                    style={styles.signupLink}
                >
                    Forgot password?
                </Text>
            </Text>

            {/*Optional Method Login*/}
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 40}}>
                <TouchableOpacity onPress={handleWithGoogle}>
                    <Image
                        style={{width: 40, height: 40}}
                        source={require('../assets/images/google.webp')}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fdfaf5",
    },
    logoContainer: {
        alignItems: "center",
    },
    screenTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: "black",
        marginTop: 20,
    },
    screenSubTitle: {
        color: 'black',
        marginTop: 12,
        marginBottom: 19
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    btn: {
        backgroundColor: '#00ab55',
        color: 'white',
        padding: 20,
        fontWeight: 'bold'
    },
    input: {
        color: 'black',
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        flex: 0,
        minWidth: "100%",
        maxWidth: "100%",
    },
    signupText: {
        marginTop: 20,
        textAlign: "center",
        color: 'black'
    },
    signupLink: {
        color: "black",
        fontWeight: "bold",
    },
    loginIcon: {
        marginLeft: 18
    }
});

export default Login;
