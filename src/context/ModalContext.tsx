import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa type cho context
interface ModalContextType {
    isShowModalOpen: boolean;
    setShowModalOpen: (isOpen: boolean) => void;
}

// Tạo context với giá trị mặc định ban đầu
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Tạo Provider component để cung cấp context cho các component con
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isShowModalOpen, setShowModalOpen] = useState<boolean>(false);

    return (
        <ModalContext.Provider value={{ isShowModalOpen, setShowModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

// Custom hook để sử dụng context dễ dàng hơn
export const useModalContext = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};
