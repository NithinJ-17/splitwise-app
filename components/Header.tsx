// components/Header.tsx
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import LoginPopover from './LoginPopover';
import UserHoverCard from './UserHoverCard';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const Header: FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [user, setUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        // Load user from localStorage if authenticated
        if (isAuthenticated) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Store the user object from localStorage
            }
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/'); // Redirect to the "/" page after logout
    };

    return (
        <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/">Setu splitXchange</Link>
                </div>
                <nav className="space-x-16 flex justify-between items-center">
                    <Link href="/home">Home</Link>
                    <Link href="/expenses">Expenses</Link>
                    <Link href="/groups">Groups</Link>
                    <Link href="/history">History</Link>
                    <Link href="/settings">Settings</Link>
                    {isAuthenticated && user ? (
                        <UserHoverCard
                            userName={user.email.split('@')[0]}  // Use the name from the stored user
                            userEmail={user.email}  // Use the email from the stored user
                            onLogout={handleLogout}
                            onWalletIntegration={() => {/* Handle wallet integration logic */}}
                        />
                    ) : (
                        <LoginPopover />
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
