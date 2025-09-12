'use client';

import { useState } from 'react';
import { useLogin } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => router.push('/dashboard'),
            }
        );
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="p-2 border rounded"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
                    Login
                </button>
            </form>
        </div>
    );
}
