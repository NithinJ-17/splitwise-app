"use client";
import { FC, useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import AlertDialog from '../AlertDialog';

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

    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('error'); // Add state for alertType

    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;

    const fetchUserIdByEmail = async (email: string): Promise<string | null> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user_id_by_email?email=${email}`);
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
                setDialogMessage('Failed to fetch user ID. Please check the email.');
                setIsDialogOpen(true);
                setAlertType('error');
            }
        } else {
            setDialogMessage('Please enter a valid registered email and amount for Paid By.');
            setIsDialogOpen(true);
            setAlertType('error');
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
                setDialogMessage('Failed to fetch user ID. Please check the email.');
                setIsDialogOpen(true);
                setAlertType('error');
            }
        } else {
            setDialogMessage('Please enter a valid registered email and amount for Split Between.');
            setIsDialogOpen(true);
            setAlertType('error');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        if (!amount || !description || !currency || Object.keys(paidBy).length === 0 || Object.keys(splitBetween).length === 0) {
            setDialogMessage('Please fill in all fields and add at least one user for Paid By and Split Between.');
            setIsDialogOpen(true);
            setAlertType('error');
            setIsLoading(false);
            return;
        }

        if (currency.length !== 3) {
            setDialogMessage('Currency code must be exactly 3 characters.');
            setIsDialogOpen(true);
            setAlertType('error');
            setIsLoading(false);
            return;
        }

        const expenseData = {
            expense_id: `exp${Math.random().toString(36).substring(2, 9)}`,
            description,
            amount,
            currency,
            paid_by: paidBy,
            split_between: splitBetween,
        };

        console.log('Request packet:', expenseData);

        try {
            const response = await axios.post('http://localhost:8000/create_expenses', expenseData, {
                headers: { 'x-token': token },
            });

            if (response.status === 200) {
                setDialogMessage('Expense created successfully');
                setIsDialogOpen(true);
                setAlertType('success');
                // Reset form fields after successful submission
                setAmount(undefined);
                setDescription('');
                setCurrency('');
                setPaidBy({});
                setSplitBetween({});
                setPaidByEmails([]);
                setSplitEmails([]);
            }
        } catch (error: unknown) {  // Type error as unknown
            // Check if error is an AxiosError
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.detail || 'Failed to create expense. Please try again.';
                setDialogMessage(errorMessage);
            } else {
                setDialogMessage('An unexpected error occurred. Please try again.');
            }
            setIsDialogOpen(true);
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit}
                className="bg-opacity-25 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl animate-fade-in"
            >
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-white">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount === undefined ? '' : amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                        className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                        className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={paidByAmount === undefined ? '' : paidByAmount}
                            onChange={(e) => setPaidByAmount(Number(e.target.value))}
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={splitAmount === undefined ? '' : splitAmount}
                            onChange={(e) => setSplitAmount(Number(e.target.value))}
                            className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                    {isLoading ? (
                        <span className="flex items-center space-x-2">
                            <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                            <span>Processing...</span>
                        </span>
                    ) : (
                        'Add Expense'
                    )}
                </Button>
            </form>

            {/* Use AlertDialog for success or failure notification */}
            <AlertDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                message={dialogMessage}
                alertType={alertType} // Pass the alertType state
            />
        </div>
    );
};

export default ExpenseForm;
