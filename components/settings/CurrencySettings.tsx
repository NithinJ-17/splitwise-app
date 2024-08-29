// components/settings/CurrencySettings.tsx
import { FC, useState } from 'react';
import Button from '../Button';

const CurrencySettings: FC = () => {
    const [currency, setCurrency] = useState<string>('USD');

    const handleSave = () => {
        // Save currency settings logic
    };

    return (
        <div className="bg-gray-900 p-10 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold">Currency Settings</h2>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white-700">Default Currency</label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-gray-900 mb-2 mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    {/* Add more currencies as needed */}
                </select>
            </div>
            <Button onClick={handleSave}>
                Save
            </Button>
        </div>
    );
};

export default CurrencySettings;
