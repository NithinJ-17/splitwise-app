// components/settings/ProfileSettings.tsx
import { FC, useState } from 'react';

const ProfileSettings: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleSave = () => {
        // Save profile settings logic
    };

    return (
        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white-700">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-white-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>
            <button onClick={handleSave} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                Save
            </button>
        </div>
    );
};

export default ProfileSettings;