// app/home/page.tsx
"use client";
import ProtectedRoute from '../../components/ProtectedRoute';

const HomePage = () => {
    return (
        <ProtectedRoute>
            <div className="text-white min-h-screen" style={{ backgroundColor: 'transparent' }}>
                <main className="container mx-auto px-4 py-8">
                    <section className="text-center mb-16">
                        <h1 className="text-6xl font-bold mb-6 shadow-xl">Welcome to Setu splitXchange</h1>
                        <p className="text-2xl shadow-xl">Your one-stop solution for managing expenses with fiat and crypto.</p>
                    </section>
                    <section className="mb-12">
                        <h2 className="text-4xl font-bold mb-6 shadow-xl">Overview</h2>
                        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
                            {/* Placeholder for Balance Overview */}
                            <p className="text-lg">Total Balance: $1500</p>
                            <p className="text-lg">Fiat Balance: $1000</p>
                            <p className="text-lg">Crypto Balance: 0.5 BTC</p>
                        </div>
                    </section>
                    <section className="mb-12">
                        <h2 className="text-4xl font-bold mb-6 shadow-xl">Recent Transactions</h2>
                        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
                            {/* Placeholder for Recent Transactions */}
                            <p className="text-lg">No recent transactions available.</p>
                        </div>
                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default HomePage;
