// components/expenses/ExpenseForm.tsx
"use client"
import { FC, useState } from 'react';

const ExpenseForm: FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-2xl">
            <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                    Amount
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white-700">
                    Description
                </label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                Add Expense
            </button>
        </form>
    );
};

export default ExpenseForm;
