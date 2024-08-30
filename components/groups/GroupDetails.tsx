"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/Button';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Table } from '@radix-ui/themes';
import ProtectedRoute from '../../components/ProtectedRoute';
import ExpenseCard from '../../components/ExpenseCard';

interface Group {
    group_id: string;
    name: string;
    members: string[];
    expenses: any[];
}

interface Expense {
    id: string;
    description: string;
    amount: number;
    currency: string;
    initial_amount?: number;  // Optional, as it may not be present in all cases
    initial_currency?: string;  // Optional, as it may not be present in all cases
    paid_by: Record<string, number>;
    split_between: Record<string, number>;
    group_id: string | null;
}

const GroupPage = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [newGroupName, setNewGroupName] = useState<string>('');
    const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState<boolean>(false);
    const [isExpenseCardOpen, setIsExpenseCardOpen] = useState<boolean>(false);
    const [dialogMessage, setDialogMessage] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/user/groups?email=${userEmail}`, {
                headers: { 'x-token': token },
            });

            const groups = response.data.groups.map((group: any) => ({
                ...group,
                expenses: group.expenses.map((expense: any) => ({
                    ...expense,
                    amount: Number(expense.amount), // Ensure amount is a number
                })),
            }));

            setGroups(groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            alert('Failed to fetch groups. Please try again.');
        }
    };

    const createGroup = async () => {
        if (!newGroupName || newGroupMembers.length === 0) {
            alert('Please provide a group name and at least one member.');
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/groups`, {
                group_id: `group_${Math.random().toString(36).substring(2, 9)}`, // Generate a unique group ID
                name: newGroupName,
                members: newGroupMembers,
            }, {
                headers: { 'x-token': token },
            });

            setDialogMessage(response.data.message);
            setIsDialogOpen(true);
            fetchGroups(); // Refresh the group list after creation
            setNewGroupName('');
            setNewGroupMembers([]);
            setIsCreateGroupOpen(false); // Hide the dialog after successful creation
        } catch (error) {
            console.error('Error creating group:', error);
            setDialogMessage('Failed to create group. Please try again.');
            setIsDialogOpen(true);
        }
    };

    return (
        <ProtectedRoute>
            <div className="mt-3 bg-opacity-50 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Groups & Group Details</h2>

                <div className="flex mb-4">
                    <Button onClick={() => setIsCreateGroupOpen(true)}>Create New Group</Button>
                </div>

                <div className="flex overflow-auto">
                    <div className="min-w-[200px] max-w-[200px] bg-gray-900 p-4 rounded-l-lg flex-shrink-0">
                        <h2 className="text-lg font-bold mb-4">Group List</h2>
                        <ul>
                            {groups.map(group => (
                                <li key={group.group_id} className="mb-2">
                                    <Button onClick={() => setSelectedGroup(group)}>{group.name}</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-grow overflow-auto">
                        {selectedGroup && (
                            <div className="bg-gray-800 p-4 rounded-r-lg min-w-[1000px]">
                                <h2 className="text-lg font-bold mb-4">Group Details - {selectedGroup.name}</h2>

                                <ScrollArea.Root style={{ height: '400px' }}>
                                    <ScrollArea.Viewport className="w-full h-full rounded overflow-auto">
                                        <Table.Root className="w-full">
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>Currency</Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>Initial Amount</Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>Initial Currency</Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>Paid By</Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>Split Between</Table.ColumnHeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {selectedGroup.expenses.length > 0 ? (
                                                    selectedGroup.expenses.map((expense: Expense) => (
                                                        <Table.Row key={expense.id} className="hover:bg-gray-700">
                                                            <Table.RowHeaderCell>{expense.description}</Table.RowHeaderCell>
                                                            <Table.Cell>{expense.amount.toFixed(2)}</Table.Cell>
                                                            <Table.Cell>{expense.currency}</Table.Cell>
                                                            <Table.Cell>{expense.initial_amount ? expense.initial_amount.toFixed(8) : 'N/A'}</Table.Cell>
                                                            <Table.Cell>{expense.initial_currency}</Table.Cell>
                                                            <Table.Cell>
                                                                {Object.entries(expense.paid_by).map(([user, amount]) => (
                                                                    <div key={user}>{`${user}: ${amount.toFixed(2)}`}</div>
                                                                ))}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {Object.entries(expense.split_between).map(([user, amount]) => (
                                                                    <div key={user}>{`${user}: ${amount.toFixed(2)}`}</div>
                                                                ))}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))
                                                ) : (
                                                    <Table.Row>
                                                        <Table.RowHeaderCell colSpan={7}>No expenses found.</Table.RowHeaderCell>
                                                    </Table.Row>
                                                )}
                                            </Table.Body>
                                        </Table.Root>
                                    </ScrollArea.Viewport>
                                    <ScrollArea.Scrollbar orientation="horizontal">
                                        <ScrollArea.Thumb className="bg-gray-700 rounded-full" />
                                    </ScrollArea.Scrollbar>
                                    <ScrollArea.Scrollbar orientation="vertical">
                                        <ScrollArea.Thumb className="bg-gray-700 rounded-full" />
                                    </ScrollArea.Scrollbar>
                                </ScrollArea.Root>
                            </div>
                        )}
                    </div>
                </div>

                {isExpenseCardOpen && selectedGroup && (
                    <ExpenseCard 
                        groupId={selectedGroup.group_id}
                        onClose={() => setIsExpenseCardOpen(false)}
                        onSuccess={fetchGroups}
                    />
                )}

                <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur z-40" />
                    <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                            <Dialog.Title className="text-lg font-bold">Notification</Dialog.Title>
                            <div className="mt-4">
                                <p className="text-white">{dialogMessage}</p>
                                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </ProtectedRoute>
    );
};

export default GroupPage;
