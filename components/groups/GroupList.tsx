// components/groups/GroupList.tsx
import { FC } from 'react';

interface Group {
    id: number;
    name: string;
    totalBalance: number;
}

interface GroupListProps {
    groups: Group[];
    onGroupSelect: (groupId: number) => void;
}

const GroupList: FC<GroupListProps> = ({ groups, onGroupSelect }) => {
    return (
        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold">Your Groups</h2>
            <ul className="mt-2">
                {groups.map((group) => (
                    <li key={group.id} className="mb-2 cursor-pointer" onClick={() => onGroupSelect(group.id)}>
                        <div className="flex justify-between">
                            <span>{group.name}</span>
                            <span>{group.totalBalance.toFixed(2)} USD</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupList;
