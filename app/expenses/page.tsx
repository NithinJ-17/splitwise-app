"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from '../../components/expenses/ExpenseForm';
import ProtectedRoute from '../../components/ProtectedRoute';
import CheckBalance from '../../components/expenses/CheckBalance';

const ExpensesPage = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;

    const fetchUserId = async (email: string): Promise<string | null> => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/user_id_by_email?email=${email}`);
            return response.data.user_id;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
    };

    useEffect(() => {
        const getUserId = async () => {
            const id = await fetchUserId(userEmail);
            setUserId(id);
        };
        getUserId();
    }, [userEmail]);

    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-2xl font-bold mb-4">Expenses</h1>
                <ExpenseForm />
                <div className="mt-8">
                    {userId && token ? (
                        <CheckBalance userId={userId} token={token} />
                    ) : (
                        <p>Loading user information...</p>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ExpensesPage;
