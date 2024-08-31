
"use client";
import * as Dialog from '@radix-ui/react-dialog';
import { FC } from 'react';
import Button from './Button';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    alertType?: 'success' | 'error';
}

const AlertDialog: FC<AlertDialogProps> = ({ isOpen, onClose, message, alertType }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in-up">
                <div className={`p-6 rounded-lg shadow-lg ${alertType === 'success' ? 'bg-green-600' : 'bg-red-800'}`}>
                    <Dialog.Title className="text-lg font-bold">
                        {alertType === 'success' ? 'Success' : 'Error'}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-white">
                        {message}
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default AlertDialog;
