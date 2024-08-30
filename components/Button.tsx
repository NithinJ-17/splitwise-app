// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    // Define the buttonClass directly inside the component
    const buttonClass = "px-10 mt-2 py-2 text-sm font-medium text-black bg-white rounded shadow-lg border border-gray-300 hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out";

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
};

export default Button;
