"use client";
import { useState } from 'react';

const CurrencySlideshow = () => {
    // Example currency values in USD and their respective values
    const currencies = [
        { name: 'Bitcoin', symbol: 'BTC', valueInUSD: '$48,000', valueInOther: '₿0.85' },
        { name: 'Ethereum', symbol: 'ETH', valueInUSD: '$3,200', valueInOther: 'Ξ2.70' },
        { name: 'Solana', symbol: 'SOL', valueInUSD: '$150', valueInOther: 'SOL10.0' },
        { name: 'USD', symbol: 'USD', valueInUSD: '$1.00', valueInOther: '₽75.0' },
        { name: 'Euro', symbol: 'EUR', valueInUSD: '€0.85', valueInOther: '₣0.90' },
        { name: 'Dogecoin', symbol: 'DOGE', valueInUSD: '$0.25', valueInOther: 'Ð1.5' },
        { name: 'Litecoin', symbol: 'LTC', valueInUSD: '$150', valueInOther: 'Ł1.2' },
        { name: 'Ripple', symbol: 'XRP', valueInUSD: '$1.00', valueInOther: 'XRP2.0' },
        { name: 'Cardano', symbol: 'ADA', valueInUSD: '$1.20', valueInOther: '₳3.0' },
        { name: 'Polkadot', symbol: 'DOT', valueInUSD: '$35.00', valueInOther: 'DOT5.0' },
        { name: 'Binance Coin', symbol: 'BNB', valueInUSD: '$400', valueInOther: 'BNB1.5' },
        { name: 'Tether', symbol: 'USDT', valueInUSD: '$1.00', valueInOther: '₮1.0' },
    ];

    // Duplicating the currency list for seamless scrolling
    const duplicatedCurrencies = [...currencies, ...currencies];

    return (
        <div className="relative overflow-hidden w-full bg-black bg-opacity-50 backdrop-blur-md py-2">
            <div className="flex animate-marquee">
                {duplicatedCurrencies.map((currency, idx) => (
                    <div
                        key={idx}
                        className="inline-block px-6 py-2 text-lg font-semibold text-white mx-2 bg-gray-900 rounded-md shadow-lg whitespace-nowrap"
                    >
                        {currency.symbol}: {currency.valueInOther} | {currency.valueInUSD}
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-marquee {
                    display: flex;
                    white-space: nowrap;
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default CurrencySlideshow;
