"use client";
import '../styles/globals.css';
import { ReactNode, useEffect } from 'react';
import Header from '../components/Header';
import CurrencySlideshow from '../components/CurrencySlideshow';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../store/store';
import { loadUserFromStorage } from '../store/authSlice';
import { useRouter } from 'next/navigation';

interface LayoutProps {
    children: ReactNode;
}

const LayoutComponent = ({ children }: LayoutProps) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        dispatch(loadUserFromStorage());

        // Redirect to the home page if authenticated
        if (isAuthenticated) {
            router.push('/home');
        }
    }, [dispatch, isAuthenticated, router]);

    return (
        <html lang="en">
            <body className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4 shadow-md">
                <Header />
                <main className="container mx-auto px-4 py-8 relative z-10">
                    {children}
                </main>
                <footer className="bg-gradient-to-r from-gray-800 via-black to-gray-900 py-4 text-center relative z-10">
                    <CurrencySlideshow />
                    <p className="text-gray-400">© 2024 Setu splitXchange. All rights reserved.</p>
                </footer> 
                <style jsx>{`
                    body {
                        background: url('/images/currencies.jpg') no-repeat center center fixed;
                        background-size: cover;
                        animation: slideBackground 60s linear infinite;
                    }

                    @keyframes slideBackground {
                        0% {
                            background-position: 0 0;
                        }
                        50% {
                            background-position: 100% 100%;
                        }
                        100% {
                            background-position: 0 0;
                        }
                    }
                `}</style>
            </body>
        </html>
    );
};

const Layout = ({ children }: LayoutProps) => (
    <Provider store={store}>
        <LayoutComponent>{children}</LayoutComponent>
    </Provider>
);

export default Layout;
