"use client";
import * as Dialog from '@radix-ui/react-dialog';
import { FC } from 'react';
import Button from './Button';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    alertType?: 'success' | 'error' | 'notification';
}

const AlertDialog: FC<AlertDialogProps> = ({ isOpen, onClose, message, alertType }) => {
    const getDialogStyle = () => {
        switch (alertType) {
            case 'success':
                return 'bg-green-600 text-white';
            case 'error':
                return 'bg-red-800 text-white';
            case 'notification':
                return 'bg-black text-white';
            default:
                return 'bg-gray-800 text-white';
        }
    };

    const getDialogTitle = () => {
        switch (alertType) {
            case 'success':
                return 'Success';
            case 'error':
                return 'Error';
            case 'notification':
                return 'Notification';
            default:
                return 'Alert';
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in-up">
                <div className={`p-6 rounded-lg shadow-lg ${getDialogStyle()}`}>
                    <Dialog.Title className="text-lg font-bold">
                        {getDialogTitle()}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2">
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
