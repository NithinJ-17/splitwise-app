import { FC, useState } from 'react';

const NotificationSettings: FC = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

    const handleToggle = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <div className="m-4 bg-opacity-50  bg-gray-900 p-8 rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-bold">Notification Settings</h2>
            <div className="mt-4 flex items-center">
                <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={handleToggle}
                    className="mr-2"
                    aria-label="Enable Notifications"
                />
                <span>Enable Notifications</span>
            </div>
        </div>
    );
};

export default NotificationSettings;
