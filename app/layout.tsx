"use client";

import '../styles/globals.css';
import { ReactNode, useEffect, useState } from 'react';
import Header from '../components/Header';
import CurrencySlideshow from '../components/CurrencySlideshow';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../store/store';
import { loadUserFromStorage } from '../store/authSlice';
import { usePathname, useRouter } from 'next/navigation';

interface LayoutProps {
    children: ReactNode;
}

const LayoutComponent = ({ children }: LayoutProps) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const pathname = usePathname();
    const router = useRouter();
    const [bgImageLoaded, setBgImageLoaded] = useState(false);

    useEffect(() => {
        dispatch(loadUserFromStorage());

        // Redirect to the home page if authenticated and on the root page
        if (isAuthenticated && pathname === '/') {
            router.push('/home');
        }
    }, [dispatch, isAuthenticated, pathname, router]);

    // Function to select background image based on the route
    const selectBackgroundImage = () => {
        if (pathname === '/') {
            return '/images/bitcoin_dig.jpg';
        }
        const images = [
            '/images/bitcoin_dig.jpg',
            '/images/bitcoin.jpg',
            '/images/currencies_dig.jpg',
            '/images/currencies.jpg',
            '/images/rupee.jpg',
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    // Preload background image to ensure it displays correctly
    useEffect(() => {
        const img = new Image();
        img.src = selectBackgroundImage();
        img.onload = () => setBgImageLoaded(true);
    }, [pathname]);

    return (
        <html lang="en">
            <body
                className={`flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white transition-all duration-500 ${bgImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    background: bgImageLoaded ? `url(${selectBackgroundImage()}) no-repeat center center fixed` : 'none',
                    backgroundSize: 'cover',
                    animation: 'slideBackground 60s linear infinite',
                }}
            >
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
                    {children}
                </main>
                <footer className="bg-gradient-to-r from-gray-800 via-black to-gray-900 py-4 text-center animate-fade-in">
                    <CurrencySlideshow />
                    <p className="text-gray-400">© 2024 SplitXchange. All rights reserved. Contact: nj17official@gmail.com. Author: Nithin J</p>
                </footer>
                <style>{`
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
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    .animate-fade-in {
                        animation: fadeIn 1s ease-in-out;
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
