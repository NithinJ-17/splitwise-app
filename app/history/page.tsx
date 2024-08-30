"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import TransactionHistory from '../../components/history/TransactionHistory';

const HistoryPage = () => {
    // Placeholder transaction data
    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-2xl font-bold mb-4"></h1>
                <TransactionHistory />
            </div>
        </ProtectedRoute>
    );
};

export default HistoryPage;
