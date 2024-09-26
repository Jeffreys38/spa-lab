import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    Button,
    ButtonText,
    Heading,
    Text,
    Input,
    InputField,
    FormControl,
    VStack,
} from "@gluestack-ui/themed";
import { useDispatch, useSelector } from "react-redux";

import DatabaseHelper from "@/src/helpers/DatabaseHelper";
import Service from "@/src/models/Service"; // Updated model import
import { useModalContext } from "@/src/context/ModalContext";
import { useMessageContext } from "@/src/context/MessageContext";
import { AppDispatch, RootState } from "@/src/store";
import { addService } from "../store/slices/serviceSlice"; // Updated action import

export default function ServiceDialog({ showAlertDialog, handleClose }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);

    const [isFocusedName, setIsFocusedName] = useState(false);
    const [isFocusedPrice, setIsFocusedPrice] = useState(false);
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');

    const { setShowModalOpen } = useModalContext();
    const { setMessage, setShowMessageOpen } = useMessageContext();

    const databaseHelper = new DatabaseHelper<Service>("services"); // Updated databaseHelper
    const dispatch: AppDispatch = useDispatch();

    const handleAdd = async () => {
        let valid = true;

        // Reset error states
        setNameError('');
        setPriceError('');

        if (name.trim() === "") {
            setNameError("Name is required");
            setIsFocusedName(true);
            valid = false;
        }

        const regexText = /[^a-zA-Z ]/;
        if (regexText.test(name)) {
            setNameError("Name is not valid, it must only contain a-z, A-Z or spaces");
            setIsFocusedName(true);
            valid = false;
        }

        if (price < 50000) {
            setPriceError("Price must be greater than 50000");
            setIsFocusedPrice(true);
            valid = false;
        }

        if (!valid) return;

        try {
            const id = await databaseHelper.add({ name, price });
            dispatch(addService({ id, name, price }));
            databaseHelper.add({ id, name, price });

            setShowModalOpen(false);
            setMessage("Service added successfully", false);
            setShowMessageOpen(true);

            setName("");
            setPrice(0);
        } catch (error) {
            setMessage("An error occurred: " + error.message, true);
            setShowMessageOpen(true);
        }
    };

    return (
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <FormControl className="p-4 border rounded-lg border-outline-300">
                    <VStack space="xl">
                        <AlertDialogHeader>
                            <Heading className="text-typography-900 leading-3">Add New Service</Heading>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <VStack space="xs">
                                <Text className="text-typography-500 leading-1">Service Name</Text>
                                <Input isFocused={isFocusedName}>
                                    <InputField
                                        type="text"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </Input>
                                {nameError && (
                                    <Text color={"$error500"} className="text-red-500">{nameError}</Text>
                                )}
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogBody>
                            <VStack space="xs">
                                <Text className="text-typography-500 leading-1">Price</Text>
                                <Input isFocused={isFocusedPrice}>
                                    <InputField
                                        type="number"
                                        value={price.toString()}
                                        onChangeText={text => setPrice(Number(text))}
                                    />
                                </Input>
                                {priceError && (
                                    <Text color={"$error500"} className="text-red-500">{priceError}</Text>
                                )}
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button className="ml-auto" onPress={handleAdd}>
                                <ButtonText className="text-typography-0">Add</ButtonText>
                            </Button>
                        </AlertDialogFooter>
                    </VStack>
                </FormControl>
            </AlertDialogContent>
        </AlertDialog>
    );
}
