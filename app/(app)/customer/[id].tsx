import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import DatabaseHelper from '@/src/helpers/DatabaseHelper';
import CustomerModel from '@/src/models/Customer'; // Updated import to use CustomerModel
import { AppDispatch } from "@/src/store";
import { useDispatch } from "react-redux";
import { updateCustomer } from "@/src/store/slices/customerSlice"; // Assuming you have a customerSlice
import { useMessageContext } from "@/src/context/MessageContext";

export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    const [customerDetail, setCustomerDetail] = useState<CustomerModel | null>(null); // Updated state type
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // States for editable form fields
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<string>('');
    const [updatedAt, setUpdatedAt] = useState<string>('');

    const dbHelper = new DatabaseHelper<CustomerModel>('customers');
    const dispatch: AppDispatch = useDispatch();
    const { setMessage, setShowMessageOpen } = useMessageContext();

    useEffect(() => {
        const fetchCustomerDetail = async () => {
            try {
                setLoading(true);
                const customer = await dbHelper.get(id as string); // Ensure id is string

                if (customer) {
                    const created = convertTimestampToDate(customer.createdAt);
                    const updated = convertTimestampToDate(customer.updatedAt);

                    setCustomerDetail(customer);
                    setName(customer.name);
                    setEmail(customer.email);
                    setPhoneNumber(customer.phoneNumber);
                    setCreatedAt(created);
                    setUpdatedAt(updated);
                } else {
                    setError('Customer not found');
                }
            } catch (error) {
                setError('Error fetching customer details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCustomerDetail();
        }
    }, [id]);

    const convertTimestampToDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
        return new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)).toString();
    };


    const handleUpdate = async () => {
        if (!customerDetail) return;

        try {
            // Validation for name
            if (name.trim() === "") {
                setMessage("Name is required", true);
                setShowMessageOpen(true);
                return;
            }

            // Validation for email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setMessage("Email must be a valid email address", true);
                setShowMessageOpen(true);
                return;
            }

            // Validation for phone number
            if (phoneNumber.trim() === "") {
                setMessage("Phone number is required", true);
                setShowMessageOpen(true);
                return;
            }

            setLoading(true);

            // Update customer with new values
            await dbHelper.update(id as string, {
                ...customerDetail,
                name,
                email,
                phoneNumber,
                updatedAt: new Date(), // Update the timestamp for when the customer was last updated
            });

            Alert.alert("Success", "Customer updated successfully!");

            // Re-fetch the updated customer data
            const updatedCustomer = await dbHelper.get(id as string);
            setCustomerDetail(updatedCustomer);
            dispatch(updateCustomer(updatedCustomer)); // Dispatch the updated customer to the Redux store
        } catch (error) {
            setError('Error updating customer');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading customer details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {customerDetail ? (
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Customer ID:</Text>
                    <Text style={styles.value}>{customerDetail.id}</Text>

                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Phone Number:</Text>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />

                    <Text style={styles.label}>Created At:</Text>
                    <TextInput
                        readOnly={true}
                        style={styles.input}
                        value={createdAt}
                    />

                    <Text style={styles.label}>Updated At:</Text>
                    <TextInput
                        readOnly={true}
                        style={styles.input}
                        value={updatedAt}
                    />

                    <TouchableOpacity style={{backgroundColor: '#00ab55', padding: 10}} onPress={handleUpdate}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>Update</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={styles.errorText}>No customer details found</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    detailContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        color: '#333',
        marginBottom: 15,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});
