// app/settings/page.tsx
"use client"
import ProfileSettings from '../../components/settings/ProfileSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import CurrencySettings from '../../components/settings/CurrencySettings';

const SettingsPage = () => {
    return (
        <div className= "bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <ProfileSettings />
            <NotificationSettings />
            <CurrencySettings />
        </div>
    );
};

export default SettingsPage;
