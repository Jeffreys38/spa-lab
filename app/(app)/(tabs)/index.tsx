import React, { useEffect } from 'react';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useModalContext } from "../../../src/context/ModalContext";
import { useMessageContext } from "../../../src/context/MessageContext";
import ModalForm from '../../../src/components/ModalForm';
import MessageToast from "@/src/components/MessageToast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '@/src/store';
import { fetchService, addService } from '@/src/store/slices/serviceSlice';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import DatabaseHelper from '@/src/helpers/DatabaseHelper';
import ServiceModel from '@/src/models/Service';
import { router } from 'expo-router';

export default function ServiceList() {
    const { isShowModalOpen, setShowModalOpen } = useModalContext();
    const { isShowMessageOpen, message, isError, setShowMessageOpen } = useMessageContext();

    const dispatch = useDispatch<AppDispatch>();
    const services = useSelector((state: RootState) => state.service.services);
    const loading = useSelector((state: RootState) => state.service.loading);
    const error = useSelector((state: RootState) => state.service.error);

    useEffect(() => {
        dispatch(fetchService());
    }, [dispatch]);

    const renderItem = ({ item }: { item: { name: string, price: string } }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleDetail(item.id)}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(Number(item.price))}</Text>
        </TouchableOpacity>
    );

    const handleDetail = (id: string) => {
        router.push(`/detail/${id}`);
    }

    const handleTestAdd = async () => {
        const databaseHelper = new DatabaseHelper<ServiceModel>("services");
        const items = [];

        for (let i = 1; i <= 15; i++) {
            const id = uuidv4();
            const name = `Service ${i}`; // Example name for the service
            const price = Math.floor(Math.random() * 1000000) + 10000; // Random price between 10,000 VND and 1,000,000 VND

            items.push({ id, name, price });
        }

        try {
            await Promise.all(items.map(async (item) => {
                await databaseHelper.add(item);
                dispatch(addService(item));
            }));
            console.log('15 items successfully added to the database');
        } catch (error) {
            console.error('Error adding items to the database:', error);
        }
    };

    // Helper function to format price as Vietnamese currency
    const formatCurrency = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <View style={{ backgroundColor: '#fdfaf5', flex: 1, padding: 10 }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ width: 300, height: 250, resizeMode: 'contain' }}
                    source={require("@/assets/images/logo.png")}
                />
            </View>
            {/*<Button title="Add 15 Services" onPress={handleAdd} />*/}

            <Text style={styles.text}>List of Services</Text>

            {loading && <Text>Loading services...</Text>}
            {error && <Text>Error: {error}</Text>}

            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            <MessageToast setShow={setShowMessageOpen} isShow={isShowMessageOpen} message={message} isError={isError} />
            <ModalForm showAlertDialog={isShowModalOpen} handleClose={setShowModalOpen} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        padding: 40,
    },
    title: {
        fontSize: 42,
        color: 'white',
        marginTop: 20,
    },
    text: {
        marginBottom: 10,
        fontSize: 18,
    },
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
    itemPrice: {
        fontSize: 16,
        color: '#888',
    },
});
