"use client";
import * as Dialog from '@radix-ui/react-dialog';
import LoginCard from '../components/LoginCard'; // Adjust the import based on your directory structure
import { useState } from 'react';

const GuestPage = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <div>
            <div className='mt-10'>
            <section className="text-center max-w-4xl mx-auto animate-fade-in-up">
                <h1 className="text-6xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-extrabold mb-6 inline-block pb-2 relative tracking-wide">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100">Split</span>
                    <span className="text-purple-700 animate-pulse">X</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100">change</span>
                    <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 w-full mx-auto rounded-full"></span>
                </h1>
            </section>
            <section className="text-center max-w-4xl mx-auto animate-fade-in-up mt-4">
                <p className="text-4xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] inline-block pb-2 relative tracking-wide text-white">
                    Simplified Splits, Universal Exchange.
                    <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 w-full mx-auto rounded-full"></span>
                </p>
            </section>
            </div>

        <div className="mt-10 flex flex-col justify-center items-center bg-transparent text-white p-8">
            {/* Top Section */}
            

            {/* Subtitle Section */}
            

            {/* Description Section */}
            <section className="relative bg-gray-900 bg-opacity-25 backdrop-blur-xl text-center max-w-2xl mx-auto animate-fade-in-up mt-12 p-8 rounded-lg shadow-2xl">
    <p className="text-xl leading-relaxed tracking-wide text-white">
        Join the revolution in expense management. Seamlessly manage your splits and exchanges in fiat and crypto with cutting-edge technology. Let’s get started today and redefine your financial freedom.
    </p>
</section>


            {/* Button Section */}
            <section className="mt-16">
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg text-2xl hover:from-purple-700 hover:to-pink-700 transition duration-300 ease-in-out animate-pulse"
                >
                    Let's Get Started
                </button>
            </section>

            {/* Dialog for the Login Card */}
            <Dialog.Root open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in" />
                <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in-up">
                    <LoginCard onClose={() => setIsLoginOpen(false)} />
                </Dialog.Content>
            </Dialog.Root>
        </div>
        </div>
    );
};

export default GuestPage;
