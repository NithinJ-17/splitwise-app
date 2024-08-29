// app/groups/page.tsx
"use client"
import { useState } from 'react';
import GroupList from '../../components/groups/GroupList';
import GroupDetails from '../../components/groups/GroupDetails';
import ProtectedRoute from '../../components/ProtectedRoute';

const GroupsPage = () => {
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    // Placeholder group data
    const groups = [
        { id: 1, name: 'Family', totalBalance: 150.25 },
        { id: 2, name: 'Friends', totalBalance: -50.00 },
        { id: 3, name: 'Work', totalBalance: 230.75 },
    ];

    const handleGroupSelect = (groupId: number) => {
        setSelectedGroupId(groupId);
    };

    return (
        <ProtectedRoute>
        <div>
            <h1 className="text-2xl font-bold mb-4">Groups</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='bg-gray-900 p-8 rounded-lg shadow-2xl'>
                    <GroupList groups={groups} onGroupSelect={handleGroupSelect} />
                </div>
                <div className='bg-gray-900 p-8 rounded-lg shadow-2xl'>
                    {selectedGroupId ? (
                        <GroupDetails
                            groupName={groups.find(group => group.id === selectedGroupId)?.name || ''}
                            expenses={[]}  // Placeholder, replace with actual expenses for the selected group
                        />
                    ) : (
                        <div className='bg-gray-900 p-8 rounded-lg shadow-2xl'>
                            <p>Select a group to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
};

export default GroupsPage;
