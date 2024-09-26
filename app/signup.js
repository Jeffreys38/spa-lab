import React, {useState} from "react";
import {Text, StyleSheet, View, TextInput, Pressable, Image, TouchableOpacity} from "react-native";
import {Formik} from "formik";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {useNavigation} from "expo-router";
import {useTheme} from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {router} from "expo-router";

import {useTogglePasswordVisibility} from "../src/components/useTogglePasswordVisibility";
import {auth} from '../src/config/firebaseConfig';
import {handleError} from "../src/handler/error";
import {LinearGradient} from "expo-linear-gradient";

export const Signup = () => {
    const {colors} = useTheme();
    const styles = initStyle(colors);

    const navigation = useNavigation();
    const [errorState, setErrorState] = useState("");

    const {
        passwordVisibility,
        handlePasswordVisibility,
        rightIcon,
        handleConfirmPasswordVisibility,
        confirmPasswordIcon,
        confirmPasswordVisibility,
    } = useTogglePasswordVisibility();

    const handleSignup = async (values) => {
        const {email, password} = values;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;

                alert("Register Successfully.");
                navigation.navigate('login');
            })
            .catch((error) => {
                console.log(error)
                alert(handleError(error));
            });
    };

    return (
        // Header
        <>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backTitle} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={34} color="white"/>
                </TouchableOpacity>
                <Image
                    source={require('../assets/images/cover.png')}
                    style={styles.headerBackground}
                />
                <View style={styles.wrapContentHeader}>
                    <Text style={{textAlign: 'center', color: 'black',fontSize: 41, fontWeight: 600, marginBottom: 14}}>Register</Text>
                    <Text style={{textAlign: 'center', color: 'black', fontSize: 20, marginBottom: 24}}>Create your account</Text>
                </View>
            </View>
            <View style={styles.container}>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                    {/* Formik Wrapper */}
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                            confirmPassword: "",
                        }}
                        onSubmit={(values) => handleSignup(values)}
                    >
                        {({
                              values,
                              touched,
                              errors,
                              handleChange,
                              handleSubmit,
                              handleBlur,
                          }) => (
                            <>
                                {/* Input fields */}
                                <TextInput
                                    name="email"
                                    leftIconName="email"
                                    placeholder="Enter email"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                    autoFocus={true}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    style={styles.input}
                                />
                                <TextInput
                                    name="password"
                                    leftIconName="key-variant"
                                    placeholder="Enter password"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={passwordVisibility}
                                    textContentType="newPassword"
                                    rightIcon={rightIcon}
                                    handlePasswordVisibility={handlePasswordVisibility}
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    style={styles.input}
                                />
                                <TextInput
                                    name="confirmPassword"
                                    leftIconName="key-variant"
                                    placeholder="Enter password again"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={confirmPasswordVisibility}
                                    textContentType="password"
                                    rightIcon={confirmPasswordIcon}
                                    handlePasswordVisibility={handleConfirmPasswordVisibility}
                                    value={values.confirmPassword}
                                    onChangeText={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    style={styles.input}
                                />

                                {/* Signup button */}
                                <Pressable style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                </Pressable>
                            </>
                        )}
                    </Formik>

                    {/* Button to navigate to Login screen */}
                    <Pressable
                        style={styles.borderlessButtonContainer}
                        title="Already have an account?"
                        onPress={() => console.log("Create Account success!")}
                    />
                </KeyboardAwareScrollView>
            </View>
        </>
    );
};

const initStyle = (colors) => {
    return StyleSheet.create({
        header: {
            position: 'relative'
        },
        backTitle: {
            position: 'absolute',
            left: 30,
            top: 70,
            zIndex: 111
        },
        headerBackground: {
            height: 400,
            resizeMode: 'cover'
        },
        wrapContentHeader: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 100,
        },
        container: {
            marginTop: 23,
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 12,
        },
        logoContainer: {
            alignItems: "center",
        },
        screenTitle: {
            fontSize: 32,
            fontWeight: "700",
            color: 'black',
            paddingTop: 20,
            paddingBottom: 20,
        },
        input: {
            height: 50,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            fontSize: 16,
            marginBottom: 15,
        },
        button: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            backgroundColor: '#00ab55',
        },
        buttonText: {
            color: 'white',
            fontWeight: "bold",
            padding: 20,
        },
        errorText: {
            color: 'red',
            marginBottom: 10,
            textAlign: 'center',
        },
        borderlessButtonContainer: {
            marginTop: 16,
            alignItems: "center",
            justifyContent: "center",
            color: colors.text
        },
        borderlessButtonText: {
            color: '#1E90FF',
            fontWeight: 'bold',
        },
    })
};

export default Signup;