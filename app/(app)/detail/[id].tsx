import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import DatabaseHelper from '@/src/helpers/DatabaseHelper';
import Service from '@/src/models/Service';
import { AppDispatch } from "@/src/store";
import { useDispatch } from "react-redux";
import { updateService } from "@/src/store/slices/serviceSlice";
import { useMessageContext } from "@/src/context/MessageContext";

export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    const [serviceDetail, setServiceDetail] = useState<Service | null>(null); // State to hold service data
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // States for editable form fields
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>(''); // Price as string to allow for TextInput

    const dbHelper = new DatabaseHelper<Service>('services'); // Adjust to the correct collection/table for services
    const dispatch: AppDispatch = useDispatch();
    const { setMessage, setShowMessageOpen } = useMessageContext();

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                setLoading(true);

                const service = await dbHelper.getByField('id', id);

                if (service) {
                    setServiceDetail(service);
                    setName(service.name);
                    setPrice(service.price.toString());
                } else {
                    setError('Service not found');
                }
            } catch (error) {
                setError('Error fetching service details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchServiceDetail(); // Fetch details if id is available
        }
    }, [id]);

    const handleUpdate = async () => {
        if (!serviceDetail) return;

        try {
            // Validation for name
            if (name.trim() === "") {
                setMessage("Name is required", true);
                setShowMessageOpen(true);
                return;
            }

            const regexText = /[^a-zA-Z]/;
            if (regexText.test(name)) {
                setMessage("Name must contain only letters (a-z or A-Z)", true);
                setShowMessageOpen(true);
                return;
            }

            // Validation for price
            const priceValue = parseFloat(price);
            if (isNaN(priceValue) || priceValue <= 0) {
                setMessage("Price must be a valid number greater than 0", true);
                setShowMessageOpen(true);
                return;
            }

            setLoading(true);

            // Update service with new values
            await dbHelper.update(id as string, {
                ...serviceDetail,
                name,
                price: priceValue,
            });

            Alert.alert("Success", "Service updated successfully!");

            // Re-fetch the updated service data
            const updatedService = await dbHelper.get(id as string);
            setServiceDetail(updatedService);
            dispatch(updateService(updatedService)); // Dispatch the updated service to the Redux store
        } catch (error) {
            setError('Error updating service');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading service details...</Text>
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
            {serviceDetail ? (
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Service ID:</Text>
                    <Text style={styles.value}>{serviceDetail.id}</Text>

                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Price:</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric" // Numeric input for price
                    />

                    <Button title="Update" onPress={handleUpdate} />
                </View>
            ) : (
                <Text style={styles.errorText}>No service details found</Text>
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
