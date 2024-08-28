// app/history/page.tsx
"use client"
import TransactionHistory from '../../components/history/TransactionHistory';

const HistoryPage = () => {
    // Placeholder transaction data
    const transactions = [
        { id: 1, description: 'Dinner', amount: 50, currency: 'USD', date: '2023-08-01' },
        { id: 2, description: 'Taxi', amount: 20, currency: 'USD', date: '2023-08-02' },
        { id: 3, description: 'Groceries', amount: 100, currency: 'USD', date: '2023-08-03' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
            <TransactionHistory transactions={transactions} />
        </div>
    );
};

export default HistoryPage;
