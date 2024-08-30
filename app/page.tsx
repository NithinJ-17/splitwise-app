import Link from 'next/link';

const GuestPage = () => {
    return (
        <div className="min-h-screen  p-8 rounded-lg text-white p-8">
            <header className="text-center mb-12">
                <h1 className="flex justify-center text-5xl font-bold mb-4">Welcome to SplitXchange</h1>
                <p className="flex justify-center ml-10 text-xl mb-4">Simplified Splits, Universal Exchange.</p>
            </header>
            <main>
                <section className="bg-gray-900 bg-opacity-50 backdrop-blur-md mb-12 rounded p-4">
                    <h2 className="text-3xl font-bold mb-4">Features</h2>
                    <ul className="list-disc pl-5">
                        <li className="mb-2">Manage both fiat and cryptocurrency expenses.</li>
                        <li className="mb-2">Track balances and transactions with ease.</li>
                        <li className="mb-2">Create and manage groups for shared expenses.</li>
                        <li className="mb-2">Enjoy real-time currency conversion updates.</li>
                    </ul>
                </section>
                <section className=" bg-gray-900 bg-opacity-50 backdrop-blur-md mb-12 rounded p-4">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="mb-4">SplitXchange helps you manage your finances by keeping track of your expenses and balances in both traditional and digital currencies. With our intuitive interface, you can easily add, track, and settle expenses with your friends, family, or within groups.</p>
                </section>
            </main>
        </div>
    );
};

export default GuestPage;


