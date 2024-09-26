import {Button, ButtonText, Divider, Icon, Toast, ToastTitle, useToast} from "@gluestack-ui/themed";
import {useEffect} from "react";

interface MessageToastProps {
    isShow: boolean;
    message: string;
    isError: boolean;
    setShow: any;
}


export default function ({ isShow, message, isError, setShow }: MessageToastProps) {
    const toast = useToast();

    useEffect(() => {
        if (isShow) {
            toast.show({
                placement:"top",
                render: ({ id }) => {
                    const toastId = "toast-" + id;
                    return (
                        <Toast
                            nativeID={toastId}
                            className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
                        >
                            {/* Send is imported from 'lucide-react-native' */}
                            <ToastTitle size="sm">{isError ? "x " : "✓ "}</ToastTitle>
                            <Divider
                                orientation="vertical"
                                className="h-[30px] bg-outline-200"
                            />
                            <ToastTitle size="sm">{message}</ToastTitle>
                        </Toast>
                    );
                },
            });

            setTimeout(() => {
                setShow(false)
            }, 3000);
        }
    }, [isShow]);
};
