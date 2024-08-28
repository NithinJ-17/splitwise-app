"use client";
import { useState, useEffect } from 'react';

const CurrencySlideshow = () => {
    const [index, setIndex] = useState(0);

    // Example currency values in USD and their respective values
    const currencies = [
        { name: 'Bitcoin', symbol: 'BTC', valueInUSD: '$48,000', valueInOther: '₿0.85' },
        { name: 'Ethereum', symbol: 'ETH', valueInUSD: '$3,200', valueInOther: 'Ξ2.70' },
        { name: 'Solana', symbol: 'SOL', valueInUSD: '$150', valueInOther: 'SOL10.0' },
        { name: 'USD', symbol: 'USD', valueInUSD: '$1.00', valueInOther: '₽75.0' },
        { name: 'Euro', symbol: 'EUR', valueInUSD: '€0.85', valueInOther: '₣0.90' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % currencies.length);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(timer);
    }, [currencies.length]);

    // Format the current index to display all currencies
    const getCurrentCurrencyInfo = () => {
        const currency = currencies[index];
        return currencies.map((cur) => 
            `${cur.symbol}: ${cur.valueInOther} | ${currency.symbol}: ${currency.valueInUSD}`
        ).join(' | ');
    };

    return (
        <div className="overflow-hidden relative">
            <div className="whitespace-nowrap animate-slide">
                {currencies.map((currency, idx) => (
                    <div
                        key={idx}
                        className={`inline-block px-4 py-2 ${index === idx ? 'text-yellow-300' : 'text-white'}`}
                    >
                        {getCurrentCurrencyInfo()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrencySlideshow;
