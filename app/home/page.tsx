"use client";
import ProtectedRoute from '../../components/ProtectedRoute';

const HomePage = () => {
    return (
        <ProtectedRoute>
            <div className="text-white ">
                <main className="container mx-auto px-4 py-12">
                    {/* Welcome Section */}
                    <section className="flex justify-center flex-col text-center mb-16">
                        <h1 className="text-6xl font-bold mb-6 inline-block pb-2 relative animate-fade-in">
                            Welcome to Split<span className="text-purple-700 animate-pulse">X</span>change
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-purple-500 w-3/6 mx-auto rounded-lg"></span>
                        </h1>
                        <p className="text-3xl inline-block pb-2 relative animate-fade-in-up">
    Simplified Splits, Universal Exchange.
    <span className="absolute left-0 right-0 bottom-0 rounded-lg"></span>
</p>

                    </section>

                    {/* Overview Section */}
                    <section className="mb-12">
                        <h2 className="text-4xl font-bold mb-6 inline-block pb-2 relative animate-fade-in-up text-center">
                            Overview
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500 w-3/3 mx-auto rounded-lg"></span>
                        </h2>
                        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-2xl animate-fade-in-up">
                            <p className="text-lg mb-4">
                                <span className="font-semibold text-blue-400">Seamless Expense Management:</span> Track and manage your expenses across both fiat and cryptocurrencies effortlessly.
                            </p>
                            <p className="text-lg mb-4">
                                <span className="font-semibold text-blue-400">Group Settlements:</span> Simplify splitting bills with friends and family, whether you’re dealing in USD or Bitcoin.
                            </p>
                            <p className="text-lg mb-4">
                                <span className="font-semibold text-blue-400">Multi-Currency Support:</span> Convert and manage your expenses in different currencies with real-time exchange rates.
                            </p>
                            <p className="text-lg">
                                <span className="font-semibold text-blue-400">Crypto Wallet Integration:</span> Securely connect your crypto wallets and manage your digital assets alongside your traditional finances.
                            </p>
                        </div>
                    </section>

                    {/* Upcoming Features Section */}
                    <section className="mb-12">
                        <h2 className="text-4xl font-bold mb-6 inline-block pb-2 relative animate-fade-in-up text-center">
                            Upcoming Features & Updates
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-purple-500 w-3/3 mx-auto rounded-lg"></span>
                        </h2>
                        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-2xl animate-fade-in-up">
                            <p className="text-lg mb-4">
                                <span className="font-semibold text-purple-400">Crypto Wallet Integration:</span> We're excited to introduce seamless crypto wallet integration, allowing you to manage both fiat and crypto expenses in one place.
                            </p>
                            <p className="text-lg mb-4">
                                <span className="font-semibold text-purple-400">Advanced Reporting:</span> Get detailed reports on your spending patterns and analyze your finances like never before.
                            </p>
                            <p className="text-lg mb-4">
                                <span className="font-semibold text-purple-400">Mobile App:</span> Stay tuned for the release of our mobile app, making it even easier to manage your finances on the go.
                            </p>
                            <p className="text-lg">
                                <span className="font-semibold text-purple-400">And much more...</span> We are constantly working to bring new features and improvements to SplitXchange, so stay tuned!
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default HomePage;
