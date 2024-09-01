"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/Button';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Table } from '@radix-ui/themes';
import ProtectedRoute from '../../components/ProtectedRoute';
import ExpenseCard from '../../components/ExpenseCard';
import AlertDialog from '../../components/AlertDialog'; // Import the AlertDialog component

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
    const [alertType, setAlertType] = useState<'success' | 'error'>('error');

    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/groups?email=${userEmail}`, {
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
    
            // Type guard to check if error is an AxiosError
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 400) {
                    setDialogMessage(error.response.data.detail || 'A 400 error occurred. Please check the details.');
                } else {
                    setDialogMessage('Failed to fetch groups. Please try again.');
                }
            } else {
                setDialogMessage('An unexpected error occurred. Please try again later.');
            }
    
            setAlertType('error');
            setIsDialogOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    const createGroup = async () => {
        if (!newGroupName || newGroupMembers.length === 0) {
            setDialogMessage('Please provide a group name and at least one member.');
            setAlertType('error');
            setIsDialogOpen(true);
            return;
        }
    
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/groups`, {
                group_id: `group_${Math.random().toString(36).substring(2, 9)}`, // Generate a unique group ID
                name: newGroupName,
                members: newGroupMembers,
            }, {
                headers: { 'x-token': token },
            });
    
            setDialogMessage(response.data.message || 'Group created successfully');
            setAlertType('success');
            setIsDialogOpen(true);
            fetchGroups(); // Refresh the group list after creation
            setNewGroupName('');
            setNewGroupMembers([]);
            setIsCreateGroupOpen(false); // Hide the dialog after successful creation
        } catch (error) {
            console.error('Error creating group:', error);
    
            // Type guard to check if error is an AxiosError
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 400) {
                    setDialogMessage(error.response.data.detail || 'A 400 error occurred. Please check the details.');
                } else {
                    setDialogMessage('Failed to create group. Please try again.');
                }
            } else {
                setDialogMessage('An unexpected error occurred. Please try again later.');
            }
    
            setAlertType('error');
            setIsDialogOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <ProtectedRoute>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Group List and Create Group Dialog */}
                <div className="bg-opacity-50 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl w-1/4 min-w-[200px]">
                    <h2 className="text-xl font-bold mb-4">Group List</h2>
                    <Button onClick={() => setIsCreateGroupOpen(true)} className='px-10 mt-2 py-2 text-sm font-medium text-white bg-black rounded shadow-lg border border-gray-300 hover:bg-gray-700 hover:shadow-xl transition-all duration-300 ease-in-out'>Create New Group +</Button>
                    <ul className="space-y-2 mt-4 shadow-lg">
                        {groups.map(group => (
                            <li key={group.group_id}>
                                <Button
                                    onClick={() => setSelectedGroup(group)}
                                >
                                    {group.name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Group Details */}
                {selectedGroup && (
                    <div className="bg-opacity-50 backdrop-blur-md bg-gray-900 p-8 rounded-lg shadow-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">Group Details - {selectedGroup.name}</h2>

                        <ScrollArea.Root style={{ height: '300px', marginTop: '1rem' }}>
                            <ScrollArea.Viewport className="w-full h-full rounded overflow-auto">
                                <Table.Root className="w-full">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Description</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Amount</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Currency</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Initial Amount</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Initial Currency</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Paid By</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="px-6 py-4 border-b border-gray-700">Split Between</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {selectedGroup.expenses.length > 0 ? (
                                            selectedGroup.expenses.map((expense: Expense) => (
                                                <Table.Row key={expense.id} className="hover:bg-gray-800">
                                                    <Table.RowHeaderCell className="px-6 py-4 border-b border-gray-700">{expense.description}</Table.RowHeaderCell>
                                                    <Table.Cell className="px-6 py-4 border-b border-gray-700">{expense.amount.toFixed(2)}</Table.Cell>
                                                    <Table.Cell className="px-6 py-4 border-b border-gray-700">{expense.currency}</Table.Cell>
                                                    <Table.Cell className="px-6 py-4 border-b border-gray-700">{expense.initial_amount ? expense.initial_amount.toFixed(8) : 'N/A'}</Table.Cell>
                                                    <Table.Cell className="px-6 py-4 border-b border-gray-700">{expense.initial_currency}</Table.Cell>
                                                    <Table.Cell className="px-6 py-4 border-b border-gray-700">
                                                        {Object.entries(expense.paid_by).map(([user, amount]) => (
                                                            <div key={user}>{`${user}: ${amount.toFixed(2)}`}</div>
                                                        ))}
                                                    </Table.Cell>
                                                    <Table.Cell className="px-6 py-4 border-b border-gray-700">
                                                        {Object.entries(expense.split_between).map(([user, amount]) => (
                                                            <div key={user}>{`${user}: ${amount.toFixed(2)}`}</div>
                                                        ))}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        ) : (
                                            <Table.Row>
                                                <Table.RowHeaderCell colSpan={7} className="px-6 py-4 border-b border-gray-700">
                                                    No expenses found.
                                                </Table.RowHeaderCell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table.Root>
                            </ScrollArea.Viewport>
                            <ScrollArea.Scrollbar
                                className="scrollbar-thumb rounded-lg bg-gray-700"
                                orientation="vertical"
                                style={{ width: '8px' }}
                            >
                                <ScrollArea.Thumb className="bg-gray-400 rounded-full" />
                            </ScrollArea.Scrollbar>
                        </ScrollArea.Root>

                        <div className="mt-8">
                            <Button
                                onClick={() => setIsExpenseCardOpen(true)}
                            >
                                Add Expense
                            </Button>
                        </div>
                    </div>
                )}

                {/* Create Group Dialog */}
                <Dialog.Root open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur z-40 animate-fade-in" />
                    <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in-up">
                        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                            <Dialog.Title className="text-lg font-bold flex justify-between items-center">
                                Create Group
                                <button onClick={() => setIsCreateGroupOpen(false)} className="text-white text-xl">×</button>
                            </Dialog.Title>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="Enter group name"
                                    className="bg-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md mb-2"
                                />
                                <input
                                    type="text"
                                    value={newGroupMembers.join(', ')}
                                    onChange={(e) => setNewGroupMembers(e.target.value.split(',').map(email => email.trim()))}
                                    placeholder="Enter member emails (comma separated)"
                                    className="bg-gray-900 mt-1 mb-3 block w-full p-2 border border-gray-300 rounded-md"
                                />
                                <Button onClick={createGroup}>
                                    {isLoading ? 'Creating...' : 'Create Group'}
                                </Button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Root>

                {isExpenseCardOpen && selectedGroup && (
                    <ExpenseCard
                        groupId={selectedGroup.group_id}
                        onClose={() => setIsExpenseCardOpen(false)}
                        onSuccess={fetchGroups}
                    />
                )}

                <AlertDialog 
                    isOpen={isDialogOpen} 
                    onClose={() => setIsDialogOpen(false)} 
                    message={dialogMessage} 
                    alertType={alertType}
                />
            </div>
        </ProtectedRoute>
    );
};

export default GroupPage;
