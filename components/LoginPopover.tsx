// components/LoginPopover.tsx
import { useState } from 'react';
import LoginCard from './LoginCard';
import Button from './Button';


const LoginPopover = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
            >
                Login / Sign Up
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
                    <LoginCard onClose={() => setOpen(false)} />
                </div>
            )}
        </>
    );
};

export default LoginPopover;
