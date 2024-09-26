import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import {FirebaseError} from "@firebase/util";
import {isSuccessResponse} from "@react-native-google-signin/google-signin";
import {isErrorWithCode} from "@react-native-google-signin/google-signin";
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';

import {AppThunk} from '../index';
import {auth} from '../../config/firebaseConfig';
import {router} from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AppHelper from "@/src/helpers/AppHelper";
import DatabaseHelper from "@/src/helpers/DatabaseHelper";
import AccountModel from "@/src/models/Account";
import databaseHelper from "@/src/helpers/DatabaseHelper";

type LoginWith = "Github" | "Google" | "Default" | null;

interface AuthState {
    user: AccountModel | null;
    loginWith: LoginWith;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loginWith: "Default",
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: AccountModel; loginWith: LoginWith; }>) => {
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;
            state.loginWith = action.payload.loginWith;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.loginWith = null
        },
    },
});

export const login = (email: string, password: string): AppThunk => async (dispatch, getState) => {
    try {
        const auth = getAuth();
        dispatch(loginStart());
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const databaseHelper = new DatabaseHelper<AccountModel>("accounts");
        let docRef = await databaseHelper.getByField('accountId', userCredential.user.uid);

        if (docRef === null) {
            const newId = await databaseHelper.add({
                accountId: userCredential.user.uid,
                email: userCredential.user.email,
                role: null,
                loginWith: "Default"
            });

            dispatch(loginSuccess({
                'user': {
                    id: newId,
                    accountId: userCredential.user.uid,
                    email: userCredential.user.email,
                    role: null,
                },
                'loginWith': "Default"
            }));
        } else {
            dispatch(loginSuccess({
                'user': {
                    id: docRef.id,
                    accountId: userCredential.user.uid,
                    email: userCredential.user.email,
                    role: docRef.role,
                },
                'loginWith': "Default"
            }));
        }
    } catch (error: any) {
        dispatch(loginFailure(error.message));
        throw new FirebaseError(error?.code, error?.message)
    }
};


export const logout = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const {loginWith} = state.auth;

        switch (loginWith) {
            case 'Github':
                break;

            case 'Google':
                await GoogleSignin.signOut();
                break;

            default:
                await signOut(auth);
                break;
        }

        dispatch(logoutSuccess());
        router.replace('/login');
    } catch (error) {
        if (error instanceof FirebaseError) {
            throw new FirebaseError(error?.code, error?.message)
        }
    }
};

export const loginWithGoogle = (): AppThunk => async (dispatch) => {
    GoogleSignin.configure({
        forceCodeForRefreshToken: true
    });

    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
            // AppHelper.showJson(response.data);
            const { user } = response.data;

            const databaseHelper = new DatabaseHelper<AccountModel>("accounts");
            let docRef = await databaseHelper.getByField('accountId',  user.id);

            // First time
            if (docRef === null) {
                const newId = await databaseHelper.add({
                    accountId: user.id,
                    email: user.email,
                    role: null,
                    loginWith: "Google",
                    photo: user.photo,
                    firstName: user.givenName,
                    lastName: user.familyName
                });

                dispatch(loginSuccess({
                    'user': {
                        id: newId,
                        accountId: user.id,
                        email: user.email,
                        role: null,
                        photo: user.photo,
                        firstName: user.givenName,
                        lastName: user.familyName
                    },
                    'loginWith': "Google"
                }));
            } else {
                // Created
                dispatch(loginSuccess({
                    'user': {
                        id: docRef.id,
                        accountId: user.id,
                        email: user.email,
                        role: docRef.role,
                        photo: user.photo,
                        firstName: user.givenName,
                        lastName: user.familyName
                    },
                    'loginWith': "Google"
                }));
            }
        } else {
            AppHelper.showJson(response, "debug");
        }
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress

                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    break;
                default:
                // some other error happened
            }
        } else {
            // an error that's not related to google sign in occurred
            throw error;
        }
    }
};

export const loginWithGithub = (): AppThunk => async (dispatch) => {
    try {
        const url = `https://github.com/login/oauth/authorize?client_id=Ov23liwlyzkWC72TFAuq&scope=repo`;
        const result = await WebBrowser.openAuthSessionAsync(url, 'exp+firebase-auth-lab://expo-development-client/?url=http%3A%2F%2F172.20.10.2%3A8081exp+firebase-auth-lab://expo-development-client/?url=http%3A%2F%2F172.20.10.2%3A8081');

        if (result.type === 'success') {
            const {code} = result.params;
        }
    } catch (error) {

    }
};

export const {loginStart, loginSuccess, loginFailure, logoutSuccess} = authSlice.actions;

export default authSlice.reducer;
