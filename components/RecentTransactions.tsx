// components/RecentTransactions.tsx
import { FC } from 'react';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    currency: string;
    date: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions: FC<RecentTransactionsProps> = ({ transactions }) => {
    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <ul className="mt-2">
                {transactions.map((transaction) => (
                    <li key={transaction.id} className="mb-2">
                        <p>{transaction.description}</p>
                        <p>{transaction.amount} {transaction.currency}</p>
                        <p>{transaction.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentTransactions;
