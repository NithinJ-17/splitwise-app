"use client";
import { FC, useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import AlertDialog from '../AlertDialog'; // Import AlertDialog

interface CheckBalanceProps {
    userId: string;
    token: string;
}

const CheckBalance: FC<CheckBalanceProps> = ({ userId, token }) => {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [dialogMessage, setDialogMessage] = useState<string>('');

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/balance/${userId}`, {
                headers: { 'x-token': token },
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setDialogMessage('Failed to fetch balance. Please try again.');
            setIsDialogOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-opacity-25 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl animate-fade-in">
            <Button onClick={fetchBalance} disabled={loading}>
                {loading ? (
                    <span className="flex items-center space-x-2">
                        <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                        <span>Checking...</span>
                    </span>
                ) : (
                    'Check Balance'
                )}
            </Button>

            {balance !== null && (
                <div className={`mt-4 transition-opacity duration-500 ${balance !== null ? 'opacity-100' : 'opacity-0'}`}>
                    <h2 className="text-xl font-bold mb-4">Your Balance</h2>
                    <p className={balance < 0 ? "text-green-500" : "text-red-500"}>
                        {balance < 0
                            ? `You are owed $${Math.abs(balance).toFixed(2)} by others.`
                            : `You owe others $${balance.toFixed(2)}.`}
                    </p>
                </div>
            )}

            <AlertDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                message={dialogMessage}
            />
        </div>
    );
};

export default CheckBalance;
