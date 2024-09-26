import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, Button, ButtonText,
    Heading, Text
} from "@gluestack-ui/themed";

export default function({ showAlertDialog, handleClose}) {
    return (
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        Are you sure you want to delete this post?
                    </Heading>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-3 mb-4">
                    <Text size="sm">
                        Deleting the post will remove it permanently and cannot be undone.
                        Please confirm if you want to proceed.
                    </Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={handleClose}
                        size="sm"
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button size="sm" onPress={handleClose}>
                        <ButtonText>Delete</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}