// app/settings/page.tsx
"use client";
import ProfileSettings from '../../components/settings/ProfileSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import CurrencySettings from '../../components/settings/CurrencySettings';
import ProtectedRoute from '../../components/ProtectedRoute';

const SettingsPage = () => {
    return (
        <ProtectedRoute>
            <div className=" bg-opacity-50 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <ProfileSettings />
                <NotificationSettings />
                <CurrencySettings />
            </div>
        </ProtectedRoute>
    );
};

export default SettingsPage;
