import { FC, useState } from 'react';
import Button from '../Button';
import AlertDialog from '../AlertDialog'; // Import AlertDialog for feedback

const CurrencySettings: FC = () => {
    const [currency, setCurrency] = useState<string>('USD');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleSave = () => {
        // Save currency settings logic
        setDialogMessage(`Currency set to ${currency}`);
        setIsDialogOpen(true);
    };

    return (
        <div className="m-4 bg-opacity-25 bg-gray-900 p-10 rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-bold">Currency Settings</h2>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white">Default Currency</label>
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
            <AlertDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                message={dialogMessage}
                alertType="success"
            />
        </div>
    );
};

export default CurrencySettings;
