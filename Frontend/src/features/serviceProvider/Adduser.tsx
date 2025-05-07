// components/Adduser.tsx
import { useState } from 'react';
import { useCreateUserMutation } from '../../services/serviceProviderService';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Define the expected error shape
interface CustomError {
    data?: {
        message?: string;
    };
    error?: string;
}

export default function Adduser() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [createUser, { isLoading, isError, error, isSuccess }] = useCreateUserMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            await createUser({ email, password, phoneNumber }).unwrap();
            setMessage('User created successfully');
            toast.success('User created successfully');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
        } catch (err) {
            if (isFetchBaseQueryError(err)) {
                const customError = err as CustomError;
                const errorMessage = customError.data?.message || customError.error || 'Failed to create user';
                setMessage(errorMessage);
                toast.error(errorMessage);
            } else if (err instanceof Error) {
                setMessage(err.message);
                toast.error(err.message);
            } else {
                setMessage('Failed to create user');
                toast.error('Failed to create user');
            }
        }
    };

    // Helper function to check if error is FetchBaseQueryError
    function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
        return typeof error === 'object' && error != null && 'status' in error;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">Create New User</h2>

            <input
                className="w-full p-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                className="w-full p-2 border rounded"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <input
                className="w-full p-2 border rounded"
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
            />

            <button
                className="bg-[hsl(var(--accent))] text-white px-4 py-2 rounded"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Creating…' : 'Create User'}
            </button>

            {isError && (
                <p className="text-red-500">
                    {(error as CustomError)?.data?.message || 'Error creating user'}
                </p>
            )}
            {isSuccess && <p className="text-green-500">{message}</p>}
        </form>
    );
}