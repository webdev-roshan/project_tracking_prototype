'use client';
import { useState } from 'react';
import { useRegister } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FolderOpen, Mail, Lock, User, Calendar, Users, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

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

    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!form.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (!form.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        
        if (!form.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setErrors({});
        
        registerMutation.mutate(form, {
            onSuccess: () => {
                router.push('/dashboard');
            },
            onError: (error: any) => {
                if (error?.response?.status === 400) {
                    const errorData = error.response.data;
                    if (errorData.email) {
                        setErrors({ email: 'Email already exists' });
                    } else {
                        setErrors({ general: 'Registration failed. Please try again.' });
                    }
                } else {
                    setErrors({ general: 'Registration failed. Please try again.' });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </button>
                    
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-600 p-3 rounded-full">
                            <FolderOpen className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h2>
                    <p className="text-gray-600">
                        Join thousands of users managing their projects efficiently
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                <span className="text-red-700 text-sm">{errors.general}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="first_name"
                                        type="text"
                                        value={form.first_name}
                                        onChange={e => setForm({ ...form, first_name: e.target.value })}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="First name"
                                    />
                                </div>
                                {errors.first_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="last_name"
                                        type="text"
                                        value={form.last_name}
                                        onChange={e => setForm({ ...form, last_name: e.target.value })}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="Last name"
                                    />
                                </div>
                                {errors.last_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                                Birth Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="birth_date"
                                    type="date"
                                    value={form.birth_date}
                                    onChange={e => setForm({ ...form, birth_date: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                Gender
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="gender"
                                    value={form.gender || ''}
                                    onChange={e => setForm({
                                        ...form,
                                        gender: e.target.value === '' ? undefined : e.target.value as Gender
                                    })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => router.push('/login')}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}