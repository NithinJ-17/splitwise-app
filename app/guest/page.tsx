import Link from 'next/link';

const GuestPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 p-8 rounded-lg shadow-2xl text-white p-8">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Welcome to Setu splitXchange</h1>
                <p className="text-xl mb-4">Your premier platform for managing expenses with both fiat and cryptocurrencies.</p>
                <Link href="/login">
                    <span className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600">Login</span>
                </Link>
                <Link href="/signup">
                    <span className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 ml-4">Sign Up</span>
                </Link>
            </header>
            <main>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Features</h2>
                    <ul className="list-disc pl-5">
                        <li className="mb-2">Manage both fiat and cryptocurrency expenses.</li>
                        <li className="mb-2">Track balances and transactions with ease.</li>
                        <li className="mb-2">Create and manage groups for shared expenses.</li>
                        <li className="mb-2">Enjoy real-time currency conversion updates.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="mb-4">Setu splitXchange helps you manage your finances by keeping track of your expenses and balances in both traditional and digital currencies. With our intuitive interface, you can easily add, track, and settle expenses with your friends, family, or within groups.</p>
                </section>
            </main>
        </div>
    );
};

export default GuestPage;
