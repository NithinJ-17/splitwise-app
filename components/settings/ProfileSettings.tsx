import { FC, useState } from 'react';
import Button from '../Button';
import AlertDialog from '../AlertDialog'; // Import AlertDialog for feedback

const ProfileSettings: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleSave = () => {
        // Save profile settings logic
        setDialogMessage('Profile settings saved successfully');
        setIsDialogOpen(true);
    };

    return (
        <div className="m-4 bg-opacity-50 bg-gray-900 p-8 rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-900 mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900 mb-2 mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
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

export default ProfileSettings;
