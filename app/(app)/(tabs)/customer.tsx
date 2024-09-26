import React, { useEffect } from 'react';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useModalContext } from "../../../src/context/ModalContext";
import { useMessageContext } from "../../../src/context/MessageContext";
import ModalFormCustomer from '../../../src/components/ModalFormCustomer';
import MessageToast from "@/src/components/MessageToast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '@/src/store';
import { fetchCustomers } from '@/src/store/slices/customerSlice'; // Make sure to implement this slice
import CustomerModel from '@/src/models/Customer'; // Ensure you have a Customer model
import { router } from 'expo-router';
import TableCustomer from '@/src/components/TableCustomer';
import { useTranslation } from 'react-i18next';

export default function CustomerList() {
    const { isShowModalOpen, setShowModalOpen } = useModalContext();
    const { isShowMessageOpen, message, isError, setShowMessageOpen } = useMessageContext();
    const { t } = useTranslation(); // Use hook to get translation function
    const dispatch = useDispatch<AppDispatch>();
    const customers = useSelector((state: RootState) => state.customer.customers);
    const loading = useSelector((state: RootState) => state.customer.loading);
    const error = useSelector((state: RootState) => state.customer.error);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const renderItem = ({ item }: { item: CustomerModel }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleDetail(item.id)}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.itemEmail}>{item.email}</Text>
        </TouchableOpacity>
    );

    const handleDetail = (id: string) => {
        router.push(`/customer/${id}`); // Navigate to customer detail page
    };

    return (
        <View style={{ backgroundColor: '#fdfaf5', flex: 1, padding: 10 }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ width: 300, height: 250, resizeMode: 'contain' }}
                    source={require("@/assets/images/logo.png")}
                />
            </View>
            <Text style={styles.text}>{t('customer.listOfCustomer')}</Text>

            {loading && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
            )}
            {error && <Text style={styles.errorText}>Error: {error}</Text>}

            {/* Display the customer list */}
            <TableCustomer />

            <ModalFormCustomer showAlertDialog={isShowModalOpen} handleClose={setShowModalOpen} />
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 4,
        borderRadius: 10,
    },
    itemName: {
        fontSize: 16,
        flex: 1,
        marginRight: 10,
    },
    itemEmail: {
        fontSize: 16,
        color: '#888',
    },
    text: {
        marginBottom: 10,
        fontSize: 18,
    },
    spinner: {
        marginVertical: 20, // Optional: adjust the vertical margin for better spacing
    },
    errorText: {
        color: 'red', // Optional: style the error text
    },
});
