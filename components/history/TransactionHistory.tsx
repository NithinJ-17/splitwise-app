// components/history/TransactionHistory.tsx
import { FC, useState } from 'react';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    currency: string;
    date: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

const TransactionHistory: FC<TransactionHistoryProps> = ({ transactions }) => {
    const [filter, setFilter] = useState<string>('');

    const filteredTransactions = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold">Transaction History</h2>
            <input
                type="text"
                placeholder="Filter by description..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mt-2 mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <ul className="mt-2">
                {filteredTransactions.map((transaction) => (
                    <li key={transaction.id} className="mb-2">
                        <div className="flex justify-between">
                            <span>{transaction.description}</span>
                            <span>{transaction.amount.toFixed(2)} {transaction.currency}</span>
                        </div>
                        <div className="text-sm text-gray-500">{transaction.date}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionHistory;
