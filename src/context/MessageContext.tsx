import React, { createContext, useState, useContext, ReactNode } from 'react';
import MessageToast from '../components/MessageToast';

interface MessageContextType {
    isShowMessageOpen: boolean;
    setShowMessageOpen: (isOpen: boolean) => void;

    message: string;
    isError: boolean;
    setMessage: (message: string, isError: boolean) => void;
    setIsError: (isError: boolean) => void;  // Add this line
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isShowMessageOpen, setShowMessageOpen] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [message, setMessage] = useState("");

    const updateMessage = (msg: string, error: boolean) => {
        setMessage(msg);
        setIsError(error);
        setShowMessageOpen(true);
    };

    return (
        <MessageContext.Provider
            value={{
                isShowMessageOpen,
                setShowMessageOpen,
                message,
                setMessage: updateMessage,
                isError,
                setIsError
            }}>
            <MessageToast
                setShow={setShowMessageOpen}
                isShow={isShowMessageOpen}
                message={message}
                isError={isError}
            />
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageContext = (): MessageContextType => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return context;
};
