import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {router} from "expo-router";

import AccountModel from '../../src/models/Account';
import DatabaseHelper from "@/src/helpers/DatabaseHelper";
import {AppDispatch, RootState} from "@/src/store";
import {useDispatch, useSelector} from "react-redux";

export default function () {

    const {user} = useSelector((state: RootState) => state.auth);

    const handleRole = async (newRole: "Employee" | "Manager") => {
        const databaseHelper = new DatabaseHelper<AccountModel>("accounts");
        // @ts-ignore
        await databaseHelper.update(user.id, {
            role: newRole,
        });

        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Get Started</Text>
                <Text style={styles.subTitle}>Start by choosing your role</Text>
                <View style={styles.wrapCard}>
                    <TouchableOpacity style={styles.card} onPress={() => handleRole('Employee')}>
                        <View style={{width: '85%'}}>
                            <Feather name="user" size={36} color="white" />
                            <Text style={styles.cardTitle}>I'm a Employee</Text>
                            <Text style={styles.cardSubTitle}>I want to use this app with purpose check in daily, check salary</Text>
                        </View>
                        <View style={{width: '25%', justifyContent: 'center', alignItems: 'center'}}>
                            <AntDesign name="right" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => handleRole('Manager') }>
                        <View style={{width: '85%'}}>
                            <MaterialIcons name="manage-accounts" size={36} color="white" />
                            <Text style={styles.cardTitle}>I'm a Manager</Text>
                            <Text style={styles.cardSubTitle}>This app easily manage all employees in company with some basic steps.</Text>
                        </View>
                        <View style={{width: '25%', justifyContent: 'center', alignItems: 'center'}}>
                            <AntDesign name="right" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/*<TouchableOpacity style={styles.button} onPress={() => { router.push('/') }}>*/}
            {/*    <Text style={styles.buttonText}>Continue</Text>*/}
            {/*</TouchableOpacity>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        paddingVertical: 80,
        paddingHorizontal: 40,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 42,
        color: 'white',
        marginTop: 20
    },
    subTitle: {
        fontSize: 20,
        color: '#5f677a',
        marginTop: 13
    },
    wrapCard: {
        marginTop: 20
    },
    card: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1d22',
        borderRadius: 14,
        padding: 22,
    },
    cardTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight: '600',
        marginTop: 13
    },
    cardSubTitle: {
        fontSize: 16,
        color: '#5f677a',
        marginTop: 13
    },
    cardIcon: {
        flex: 2
    },
    button: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 23,
        fontWeight: '600'
    }
})