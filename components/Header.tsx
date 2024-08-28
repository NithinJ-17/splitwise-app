// components/Header.tsx
import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => {
    return (
        <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/">Setu splitXchange</Link>
                </div>
                <nav className="space-x-12">
                    <Link href="/">Home</Link>
                    <Link href="/expenses">Expenses</Link>
                    <Link href="/groups">Groups</Link>
                    <Link href="/history">History</Link>
                    <Link href="/settings">Settings</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
