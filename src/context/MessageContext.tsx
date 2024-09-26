import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MessageContextType {
    isShowMessageOpen: boolean;
    setShowMessageOpen: (isOpen: boolean) => void;

    message: string;
    isError: boolean
    setMessage: (message: string, isError: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isShowMessageOpen, setShowMessageOpen] = useState<boolean>(false);
    const [message, setMessage] = useState("");

    return (
        <MessageContext.Provider value={{ isShowMessageOpen, setShowMessageOpen, message, setMessage }}>
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
