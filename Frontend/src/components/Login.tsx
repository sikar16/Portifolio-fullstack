// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLoginMutation } from '../services/loginService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = await login({ email, password }).unwrap();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('role', data.user.role);
            console.log(data)

            if (data.user.role === 'serviceProvider') {
                navigate('/dashboard_sp');
            } else if (data.user.role === 'user') {
                navigate('/dashboard');
            } else {
                navigate('/denied');
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="flex items-center justify-center p-4 min-h-screen bg-gradient-to-r">
            <Card className="w-full max-w-md bg-[#27272c] border-none shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-white">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="mt-1 w-full bg-[#333] text-white border-gray-700 focus:ring-2 focus:ring-accent"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="mt-1 w-full bg-[#333] text-white border-gray-700 focus:ring-2 focus:ring-accent"
                                required
                            />
                        </div>
                        {isError && (
                            <p className="text-red-500 text-sm">
                                {'status' in error
                                    ? (error.data as { message?: string })?.message || 'An error occurred.'
                                    : (error as { message?: string })?.message || 'An error occurred.'}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent-hover text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>
                </CardContent>

            </Card>
        </div>
    );
};

export default Login;
