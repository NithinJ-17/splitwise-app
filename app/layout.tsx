// app/layout.tsx
import '../styles/globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';
import CurrencySlideshow from '../components/CurrencySlideshow';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4 shadow-md">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="bg-gradient-to-r from-gray-800 via-black to-gray-900 py-4 text-center">
                    <CurrencySlideshow />
                    <p className="text-gray-400">© 2024 Setu splitXchange. All rights reserved.</p>
                </footer>
            </body>
        </html>
    );
};

export default Layout;
