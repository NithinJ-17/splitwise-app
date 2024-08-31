"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import TransactionHistory from '../../components/history/TransactionHistory';

const HistoryPage = () => {
    return (
        <ProtectedRoute>
            <div className="p-4 animate-fade-in-up transition-transform transform scale-95 hover:scale-100 duration-500 ease-in-out">
                <h1 className="text-2xl font-bold mb-4 animate-fade-in">Transaction History</h1>
                <TransactionHistory />
            </div>
        </ProtectedRoute>
    );
};

export default HistoryPage;
