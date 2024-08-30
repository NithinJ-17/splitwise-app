"use client";
import { FC, useState } from 'react';
import axios from 'axios';
import Button from './Button';
import * as Dialog from '@radix-ui/react-dialog';

interface ExpenseCardProps {
    groupId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ExpenseCard: FC<ExpenseCardProps> = ({ groupId, onClose, onSuccess }) => {
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('');
    const [paidByUser, setPaidByUser] = useState<string>('');
    const [paidByAmount, setPaidByAmount] = useState<number>(0);
    const [paidBy, setPaidBy] = useState<{ [key: string]: number }>({});
    const [splitBetween, setSplitBetween] = useState<{ [key: string]: number }>({});
    const [splitUser, setSplitUser] = useState<string>('');
    const [splitAmount, setSplitAmount] = useState<number>(0);

    const token = localStorage.getItem('token');

    const handleAddPaidByUser = () => {
        if (paidByUser && paidByAmount > 0) {
            setPaidBy({ ...paidBy, [paidByUser]: paidByAmount });
            setPaidByUser('');
            setPaidByAmount(0);
        } else {
            alert('Please enter a valid user and amount for payment.');
        }
    };

    const handleAddSplitUser = () => {
        if (splitUser && splitAmount > 0) {
            setSplitBetween({ ...splitBetween, [splitUser]: splitAmount });
            setSplitUser('');
            setSplitAmount(0);
        } else {
            alert('Please enter a valid user and amount for splitting.');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const expenseData = {
            expense_id: `exp${Math.random().toString(36).substring(2, 9)}`,
            description,
            amount,
            currency,
            paid_by: paidBy,
            split_between: splitBetween,
        };

        try {
            const response = await axios.post(`http://127.0.0.1:8000/groups/${groupId}/add_expense`, expenseData, {
                headers: { 'x-token': token },
            });

            if (response.status === 200) {
                alert('Expense added successfully');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense. Please try again.');
        }
    };

    return (
        <Dialog.Root open onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg"> {/* Adjusted width and max-width */}
                    <Dialog.Title className="text-lg font-bold flex justify-between items-center">
                        Add Expense
                        <button onClick={onClose} className="text-white text-xl">×</button>
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-white">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount === 0 ? '' : amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="currency" className="block text-sm font-medium text-white">Currency</label>
                            <input
                                type="text"
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                maxLength={3}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="paidByUser" className="block text-sm font-medium text-white">Paid By</label>
                            <input
                                type="email"
                                id="paidByUser"
                                value={paidByUser}
                                onChange={(e) => setPaidByUser(e.target.value)}
                                placeholder="Enter email"
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                id="paidByAmount"
                                value={paidByAmount === 0 ? '' : paidByAmount}
                                onChange={(e) => setPaidByAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                            <Button type="button" onClick={handleAddPaidByUser} >Add Paid By User</Button>
                            <ul className="mt-2">
                                {Object.entries(paidBy).map(([user, amount]) => (
                                    <li key={user} className="text-white">
                                        {user}: {amount.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="splitUser" className="block text-sm font-medium text-white">Split Between</label>
                            <input
                                type="email"
                                id="splitUser"
                                value={splitUser}
                                onChange={(e) => setSplitUser(e.target.value)}
                                placeholder="Enter email"
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                id="splitAmount"
                                value={splitAmount === 0 ? '' : splitAmount}
                                onChange={(e) => setSplitAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                                className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                            <Button type="button" onClick={handleAddSplitUser}>Add Split User</Button>
                            <ul className="mt-2">
                                {Object.entries(splitBetween).map(([user, amount]) => (
                                    <li key={user} className="text-white">
                                        {user}: {amount.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default ExpenseCard;
