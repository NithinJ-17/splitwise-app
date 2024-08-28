// components/groups/GroupDetails.tsx
import { FC } from 'react';

interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    participants: string[];
}

interface GroupDetailsProps {
    groupName: string;
    expenses: Expense[];
}

const GroupDetails: FC<GroupDetailsProps> = ({ groupName, expenses }) => {
    return (
        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold">{groupName}</h2>
            <ul className="mt-2">
                {expenses.map((expense) => (
                    <li key={expense.id} className="mb-2">
                        <div className="flex justify-between">
                            <span>{expense.description}</span>
                            <span>{expense.amount.toFixed(2)} USD</span>
                        </div>
                        <div className="text-sm text-gray-500">{expense.date}</div>
                        <div className="text-sm">Participants: {expense.participants.join(', ')}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupDetails;
