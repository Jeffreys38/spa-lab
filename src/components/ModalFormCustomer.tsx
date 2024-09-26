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
import CustomerModel from "@/src/models/Customer"; // Updated model import
import { useModalContext } from "@/src/context/ModalContext";
import { useMessageContext } from "@/src/context/MessageContext";
import { AppDispatch, RootState } from "@/src/store";
import { addCustomer } from "../store/slices/customerSlice"; // Updated action import

export default function CustomerDialog({ showAlertDialog, handleClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [isFocusedName, setIsFocusedName] = useState(false);
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isFocusedPhone, setIsFocusedPhone] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const { setShowModalOpen } = useModalContext();
    const { setMessage, setShowMessageOpen } = useMessageContext();

    const databaseHelper = new DatabaseHelper<CustomerModel>("customers"); // Updated databaseHelper
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleAdd = async () => {
        let valid = true;

        // Reset error states
        setNameError('');
        setEmailError('');
        setPhoneError('');

        if (name.trim() === "") {
            setNameError("Name is required");
            setIsFocusedName(true);
            valid = false;
        }

        if (email.trim() === "" || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Valid email is required");
            setIsFocusedEmail(true);
            valid = false;
        }

        if (phoneNumber.trim() === "" || !/^\d{10}$/.test(phoneNumber)) {
            setPhoneError("Phone number must be 10 digits");
            setIsFocusedPhone(true);
            valid = false;
        }

        if (!valid) return;

        const creatorName = (user.lastName) ? `${user.lastName} ${user.firstName}` : user.email;

        try {
            const id = await databaseHelper.add({
                name,
                email,
                phoneNumber,
                creator: creatorName,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            dispatch(addCustomer({
                id,
                name,
                email,
                phoneNumber,
                creator: creatorName,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            setShowModalOpen(false);
            setMessage("Customer added successfully", false);
            setShowMessageOpen(true);

            setName("");
            setEmail("");
            setPhoneNumber("");
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
                            <Heading className="text-typography-900 leading-3">Add New Customer</Heading>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <VStack space="xs">
                                <Text className="text-typography-500 leading-1">Customer Name</Text>
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
                                <Text className="text-typography-500 leading-1">Email</Text>
                                <Input isFocused={isFocusedEmail}>
                                    <InputField
                                        type="email"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </Input>
                                {emailError && (
                                    <Text color={"$error500"} className="text-red-500">{emailError}</Text>
                                )}
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogBody>
                            <VStack space="xs">
                                <Text className="text-typography-500 leading-1">Phone Number</Text>
                                <Input isFocused={isFocusedPhone}>
                                    <InputField
                                        type="text"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                    />
                                </Input>
                                {phoneError && (
                                    <Text color={"$error500"} className="text-red-500">{phoneError}</Text>
                                )}
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button style={{ backgroundColor: '#00ab55' }} className="ml-auto" onPress={handleAdd}>
                                <ButtonText style={{ fontWeight: 'bold' }} className="text-typography-0">Add</ButtonText>
                            </Button>
                        </AlertDialogFooter>
                    </VStack>
                </FormControl>
            </AlertDialogContent>
        </AlertDialog>
    );
}
