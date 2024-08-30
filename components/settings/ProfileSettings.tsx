// components/settings/ProfileSettings.tsx
import { FC, useState } from 'react';
import Button from '../Button';

const ProfileSettings: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleSave = () => {
        // Save profile settings logic
    };

    return (
        <div className="m-4 bg-opacity-50 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white-700">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-900 mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white-700">Email</label>
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
        </div>
    );
};

export default ProfileSettings;
