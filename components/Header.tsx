import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname to get the current route
import LoginPopover from './LoginPopover';
import UserHoverCard from './UserHoverCard';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const Header: FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname(); // Get the current route
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

    const linkClasses = (href: string) =>
        `px-3 py-2 rounded-lg font-medium text-lg transition duration-300 transform-gpu relative z-10 ${
            pathname === href
                ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white shadow-lg scale-110'
                : 'text-gray-400 hover:text-white hover:scale-105 hover:skew-y-3'
        }`;

    return (
        <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4 shadow-md relative overflow-hidden">
            {/* Animated line graph */}
            <div className="absolute top-10 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 animate-graph-line opacity-50 h-[1px]"></div>
            </div>

            <div className="container mx-auto flex justify-between items-center relative z-20 opacity-100">
                <div className="text-2xl font-bold">
                    <Link href="/">SplitXchange</Link>
                </div>
                {isAuthenticated && pathname !== '/' && (
                    <nav className="space-x-16 flex justify-between items-center">
                        <Link href="/home" className={linkClasses('/home')}>
                            Home
                        </Link>
                        <Link href="/expenses" className={linkClasses('/expenses')}>
                            Expenses
                        </Link>
                        <Link href="/groups" className={linkClasses('/groups')}>
                            Groups
                        </Link>
                        <Link href="/history" className={linkClasses('/history')}>
                            History
                        </Link>
                        <Link href="/settings" className={linkClasses('/settings')}>
                            Settings
                        </Link>
                        {user && (
                            <UserHoverCard
                                userName={user.email.split('@')[0]}  // Use the name from the stored user
                                userEmail={user.email}  // Use the email from the stored user
                                onLogout={handleLogout}
                                onWalletIntegration={() => {/* Handle wallet integration logic */}}
                            />
                        )}
                    </nav>
                )}
                {!isAuthenticated && <LoginPopover />}
            </div>
        </header>
    );
};

export default Header;
