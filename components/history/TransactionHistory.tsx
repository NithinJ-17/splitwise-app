"use client";
import { FC, useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Table } from '@radix-ui/themes';
import AlertDialog from '../AlertDialog'; // Import the AlertDialog component

interface Transaction {
    id: string;
    description: string;
    amount: number;
    currency: string;
    date: string;
    paid_by: Record<string, number>;
    split_between: Record<string, number>;
    group_id: string | null;
    initial_currency: string;
    initial_amount: number;
}

const TransactionHistory: FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [dialogMessage, setDialogMessage] = useState<string>('');

    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
    const userEmail = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('user') || '{}').email : null;

    const fetchUserId = async (email: string): Promise<string | null> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user_id_by_email?email=${email}`);
            return response.data.user_id;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
    };

    const fetchTransactions = async () => {
        setIsLoading(true);
        const userId = await fetchUserId(userEmail);
        if (!userId) {
            setDialogMessage('Failed to fetch user ID.');
            setIsDialogOpen(true);
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses/${userId}`, {
                headers: { 'x-token': token },
            });

            if (response.data.message === "No expenses found for this user") {
                const noexpense = "No expenses made by the User"
                setDialogMessage(noexpense);
                setIsDialogOpen(true);
                setTransactions([]); // Clear transactions to show empty state
            } else {
                const expenses = response.data.expenses.map((expense: any) => ({
                    id: expense.expense_id,
                    description: expense.description,
                    amount: expense.amount,
                    currency: expense.currency,
                    date: expense.date,
                    paid_by: expense.paid_by,
                    split_between: expense.split_between,
                    group_id: expense.group_id,
                    initial_currency: expense.initial_currency,
                    initial_amount: expense.initial_amount,
                }));

                setTransactions(expenses);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setDialogMessage('Failed to fetch transactions. Please try again.');
            setIsDialogOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-2xl animate-fade-in-up transition-all duration-500 ease-in-out">

            <input
                type="text"
                placeholder="Filter by description..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-900 mt-2 mb-4 p-2 border border-gray-300 rounded-md w-full"
            />

            <Button onClick={fetchTransactions} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Get Records'}
            </Button>

            <ScrollArea.Root className="animate-fade-in mt-4" style={{ height: '500px' }}>
                <ScrollArea.Viewport className="w-full h-full rounded overflow-auto">
                    <Table.Root className="flex justify-center item-center w-full">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Description</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Amount</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Currency</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Initial Amount</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Initial Currency</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Date</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Paid By</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-6 py-3 border-b border-gray-700">Split Between</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="px-4 py-3 border-b border-gray-700">Group ID</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.slice(0, 100).map((transaction) => (
                                    <Table.Row key={transaction.id} className="hover:bg-gray-800 transition-colors duration-300">
                                        <Table.RowHeaderCell className="px-6 py-3 border-b border-gray-700">{transaction.description}</Table.RowHeaderCell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">{transaction.amount ? transaction.amount.toFixed(2) : 'N/A'}</Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">{transaction.currency}</Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">{transaction.initial_amount ? transaction.initial_amount.toFixed(8) : 'N/A'}</Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">{transaction.initial_currency}</Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">{new Date(transaction.date).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">
                                            {Object.entries(transaction.paid_by).map(([user, amount]) => (
                                                <div key={user}>{`${user}: ${amount.toFixed(2)}`}</div>
                                            ))}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">
                                            {Object.entries(transaction.split_between).map(([user, amount]) => (
                                                <div key={user}>{`${user}: ${amount.toFixed(2)}`}</div>
                                            ))}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-3 border-b border-gray-700">{transaction.group_id || 'N/A'}</Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.RowHeaderCell colSpan={9} className="px-6 py-3 border-b border-gray-700">
                                        Use 'Get Records' to populate your transactions here.
                                    </Table.RowHeaderCell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                    className="scrollbar-thumb rounded-lg bg-gray-700"
                    orientation="vertical"
                    style={{ width: '8px' }}
                >
                    <ScrollArea.Thumb className="bg-gray-400 rounded-full" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar
                    className="scrollbar-thumb rounded-lg bg-gray-700"
                    orientation="horizontal"
                    style={{ height: '8px' }}
                >
                    <ScrollArea.Thumb className="bg-gray-400 rounded-full" />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <AlertDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                message={dialogMessage}
            />
        </div>
    );
};

export default TransactionHistory;
