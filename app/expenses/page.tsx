// app/expenses/page.tsx
import ExpenseForm from '../../components/expenses/ExpenseForm';
import ProtectedRoute from '../../components/ProtectedRoute';

const ExpensesPage = () => {
    return (
        <ProtectedRoute>
        <div>
            <h1 className="text-2xl font-bold mb-4">Expenses</h1>
            <ExpenseForm />
            {/* Placeholder for Expense List */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Existing Expenses</h2>
                <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
                    {/* Expense List Component will go here */}
                    <p>No expenses added yet.</p>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
};

export default ExpensesPage;
