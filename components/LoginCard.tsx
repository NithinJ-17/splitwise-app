import * as React from 'react';
import * as Label from '@radix-ui/react-label';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { login } from '../store/authSlice';

interface LoginCardProps {
    onClose: () => void;
}

const LoginCard = ({ onClose }: LoginCardProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [dialogMessage, setDialogMessage] = React.useState('');
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                dispatch(login({ user: { email }, token }));
                console.log("Logged in successfully:", data);
                onClose();
                router.push('/home');
            } else {
                setDialogMessage("Login failed. Please check your credentials and try again.");
                setIsDialogOpen(true);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setDialogMessage("An error occurred. Please try again later.");
            setIsDialogOpen(true);
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                setDialogMessage("Registration successful! Please log in to continue.");
                setIsDialogOpen(true);
            } else {
                setDialogMessage("Signup failed. Please try again later.");
                setIsDialogOpen(true);
            }
        } catch (error) {
            console.error("Error signing up:", error);
            setDialogMessage("An error occurred. Please try again later.");
            setIsDialogOpen(true);
        }
    };

    return (
        <>
            <div className="relative text-white p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md animate-fade-in-up">
                <button
                    className="absolute top-3 right-3 text-white text-xl hover:text-red-500 transition-all duration-200 ease-in-out"
                    onClick={onClose}
                >
                    &times;
                </button>
                <Tabs.Root defaultValue="login">
                    <Tabs.List className="flex justify-center space-x-2 mb-4">
                        <Tabs.Trigger 
                            value="login" 
                            className="px-4 py-2 text-sm font-medium text-black bg-white rounded shadow-lg border border-gray-300 hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out"
                        >
                            Login
                        </Tabs.Trigger>
                        <Tabs.Trigger 
                            value="signup" 
                            className="px-4 py-2 text-sm font-medium text-black bg-white rounded shadow-lg border border-gray-300 hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out"
                        >
                            Sign Up
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="login">
                        <h2 className="text-xl font-bold mb-4">Login</h2>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="animate-fade-in">
                                <Label.Root htmlFor="email" className="block mb-2 text-sm font-medium">Email</Label.Root>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full p-2 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                    required
                                />
                            </div>
                            <div className="animate-fade-in">
                                <Label.Root htmlFor="password" className="block mb-2 text-sm font-medium">Password</Label.Root>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full p-2 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                    required
                                />
                            </div>
                            <Button type="submit">Login</Button>
                        </form>
                    </Tabs.Content>

                    <Tabs.Content value="signup">
                        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            <div className="animate-fade-in">
                                <Label.Root htmlFor="name" className="block mb-2 text-sm font-medium">Name</Label.Root>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full p-2 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                    required
                                />
                            </div>
                            <div className="animate-fade-in">
                                <Label.Root htmlFor="email" className="block mb-2 text-sm font-medium">Email</Label.Root>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full p-2 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                    required
                                />
                            </div>
                            <div className="animate-fade-in">
                                <Label.Root htmlFor="password" className="block mb-2 text-sm font-medium">Password</Label.Root>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full p-2 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                    required
                                />
                            </div>
                            <Button type="submit">Sign Up</Button>
                        </form>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in" />
                <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-black p-6 rounded-lg shadow-lg">
                        <Dialog.Title className="text-lg font-bold">Notification</Dialog.Title>
                        <Dialog.Description className="mt-2">
                            {dialogMessage}
                        </Dialog.Description>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Root>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounceIn {
                    0%, 20%, 40%, 60%, 80%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.6s ease-in-out;
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-in-out;
                }

                .animate-bounce-in {
                    animation: bounceIn 1s ease-in-out;
                }
            `}</style>
        </>
    );
};

export default LoginCard;
