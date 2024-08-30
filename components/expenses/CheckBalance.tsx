"use client";
import { FC, useState } from 'react';
import Button from '../Button';
import axios from 'axios';

interface CheckBalanceProps {
    userId: string;
    token: string;
}

const CheckBalance: FC<CheckBalanceProps> = ({ userId, token }) => {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/balance/${userId}`, {
                headers: { 'x-token': token },
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            alert('Failed to fetch balance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-opacity-25 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl">
            <Button onClick={fetchBalance} disabled={loading}>
                {loading ? 'Checking...' : 'Check Balance'}
            </Button>

            {balance !== null && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">Your Balance</h2>
                    <p className={balance < 0 ? "text-green-500" : "text-red-500"}>
                        {balance < 0
                            ? `You are owed $${Math.abs(balance).toFixed(2)} by others.`
                            : `You owe others $${balance.toFixed(2)}.`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CheckBalance;
