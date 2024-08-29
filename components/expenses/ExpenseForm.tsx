"use client";
import { FC, useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';

const ExpenseForm: FC = () => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [paidByUser, setPaidByUser] = useState<string>('');
    const [paidByAmount, setPaidByAmount] = useState<number | undefined>(undefined);
    const [paidBy, setPaidBy] = useState<{ [key: string]: number }>({});
    const [splitUser, setSplitUser] = useState<string>('');
    const [splitAmount, setSplitAmount] = useState<number | undefined>(undefined);
    const [splitBetween, setSplitBetween] = useState<{ [key: string]: number }>({});
    const [paidByEmails, setPaidByEmails] = useState<string[]>([]);
    const [splitEmails, setSplitEmails] = useState<string[]>([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    const fetchUserIdByEmail = async (email: string): Promise<string | null> => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/user_id_by_email?email=${email}`);
            return response.data.user_id;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
    };

    const handleAddPaidBy = async () => {
        if (paidByUser && paidByAmount && paidByAmount > 0) {
            const userId = await fetchUserIdByEmail(paidByUser);
            if (userId) {
                setPaidBy((prevState) => ({
                    ...prevState,
                    [userId]: paidByAmount,
                }));
                setPaidByEmails((prevState) => [...prevState, paidByUser]);
                setPaidByUser('');
                setPaidByAmount(undefined);
            } else {
                alert('Failed to fetch user ID. Please check the email.');
            }
        } else {
            alert('Please enter a valid registered email and amount for Paid By.');
        }
    };

    const handleAddUserSplit = async () => {
        if (splitUser && splitAmount && splitAmount > 0) {
            const userId = await fetchUserIdByEmail(splitUser);
            if (userId) {
                setSplitBetween((prevState) => ({
                    ...prevState,
                    [userId]: splitAmount,
                }));
                setSplitEmails((prevState) => [...prevState, splitUser]);
                setSplitUser('');
                setSplitAmount(undefined);
            } else {
                alert('Failed to fetch user ID. Please check the email.');
            }
        } else {
            alert('Please enter a valid registered email and amount for Split Between.');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!amount || !description || !currency || Object.keys(paidBy).length === 0 || Object.keys(splitBetween).length === 0) {
            alert('Please fill in all fields and add at least one user for Paid By and Split Between.');
            return;
        }

        if (currency.length !== 3) {
            alert('Currency code must be exactly 3 characters.');
            return;
        }

        const expenseData = {
            expense_id: `exp${Math.random().toString(36).substring(2, 9)}`, // Example to generate a random ID
            description,
            amount,
            currency,
            paid_by: paidBy,
            split_between: splitBetween,
        };

        console.log('Request packet:', expenseData); // For testing

        try {
            const response = await axios.post('http://localhost:8000/create_expenses', expenseData, {
                headers: { 'x-token': token },
            });

            if (response.status === 200) {
                setDialogMessage('Expense created successfully');
                setIsDialogOpen(true);
                // Reset form fields after successful submission
                setAmount(undefined);
                setDescription('');
                setCurrency('');
                setPaidBy({});
                setSplitBetween({});
                setPaidByEmails([]);
                setSplitEmails([]);
            }
        } catch (error) {
            console.error('Error creating expense:', error);
            setDialogMessage('Failed to create expense. Please try again.');
            setIsDialogOpen(true);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-2xl">
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-white">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount === undefined ? '' : amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter the amount"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-white">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter a description"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="currency" className="block text-sm font-medium text-white">
                        Currency (3 characters)
                    </label>
                    <input
                        type="text"
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value.toUpperCase())}  // Ensure uppercase
                        className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        maxLength={3}
                        placeholder="Enter currency code (e.g., BTC)"
                        required
                    />
                </div>

                {/* Paid By Section */}
                <div className="mb-4">
                    <label htmlFor="paidByUser" className="block text-sm font-medium text-white">
                        Add User to Paid By
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="email"
                            placeholder="Enter registered email"
                            value={paidByUser}
                            onChange={(e) => setPaidByUser(e.target.value)}
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={paidByAmount === undefined ? '' : paidByAmount}
                            onChange={(e) => setPaidByAmount(Number(e.target.value))}
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <Button type="button" onClick={handleAddPaidBy}>
                            Add
                        </Button>
                    </div>
                    <ul className="mt-4">
                        {paidByEmails.map((email, index) => (
                            <li key={index} className="text-white">
                                {email}: {paidBy[Object.keys(paidBy)[index]]}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Split Between Section */}
                <div className="mb-4">
                    <label htmlFor="splitBetween" className="block text-sm font-medium text-white">
                        Add User to Split Between
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="email"
                            placeholder="Enter registered email"
                            value={splitUser}
                            onChange={(e) => setSplitUser(e.target.value)}
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={splitAmount === undefined ? '' : splitAmount}
                            onChange={(e) => setSplitAmount(Number(e.target.value))}
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <Button type="button" onClick={handleAddUserSplit}>
                            Add
                        </Button>
                    </div>
                    <ul className="mt-4">
                        {splitEmails.map((email, index) => (
                            <li key={index} className="text-white">
                                {email}: {splitBetween[Object.keys(splitBetween)[index]]}
                            </li>
                        ))}
                    </ul>
                </div>

                <Button type="submit">
                    Add Expense
                </Button>
            </form>

            {/* Dialog for success or failure notification */}
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="bg-black p-6 rounded-lg shadow-lg">
                        <Dialog.Title className="text-lg font-bold">Notification</Dialog.Title>
                        <Dialog.Description className="mt-2">
                            {dialogMessage}
                        </Dialog.Description>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};

export default ExpenseForm;
