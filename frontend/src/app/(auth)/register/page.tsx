'use client';
import { useState } from 'react';
import { useRegister } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const registerMutation = useRegister();

    type Gender = 'male' | 'female' | 'others' | undefined;

    const [form, setForm] = useState<{
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        birth_date: string;
        gender?: Gender;
    }>({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate(form, {
            onSuccess: () => router.push('/dashboard'),
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={e => setForm({ ...form, first_name: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={e => setForm({ ...form, last_name: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Birth Date"
                    type="date"
                    value={form.birth_date}
                    onChange={e => setForm({ ...form, birth_date: e.target.value })}
                    className="p-2 border rounded"
                />
                <select
                    value={form.gender || ''}
                    onChange={e => setForm({
                        ...form,
                        gender: e.target.value === '' ? undefined : e.target.value as Gender
                    })}
                    className="p-2 border rounded"
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
                <button type="submit" className="bg-green-500 text-white p-2 rounded mt-2">
                    Register
                </button>
            </form>
        </div>
    );
}