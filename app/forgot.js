import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, Pressable, Alert } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {router} from "expo-router";
import {useSelector} from "react-redux";

import {RootState} from "../src/store";
import {handleError} from "../src/handler/error";

const Forgot = () => {
  const [errorState, setErrorState] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const auth = getAuth();

  const handlePasswordReset = async (values) => {
    const { email } = values;
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "Check your email for a password reset link.");
      router.replace('/login');
    } catch (error) {
      alert(handleError(error));
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.logoContainer}>
          <Text style={styles.screenTitle}>Forgot Password</Text>
        </View>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => handlePasswordReset(values)}
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
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                style={styles.input}
              />
              
              {/* Display Screen Error Messages */}
              {errorState !== "" && (
                <Text style={styles.errorText}>{errorState}</Text>
              )}
              
              {/* Reset Password button */}
              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{loading ? "Please a moment" : "Reset Password"}</Text>
              </Pressable>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: 'white',
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
  },
  borderlessButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default Forgot;
