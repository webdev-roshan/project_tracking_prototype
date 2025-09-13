'use client';

import { useState } from 'react';
import { useLogin } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FolderOpen, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});

    const validateForm = () => {
        const newErrors: {email?: string; password?: string; general?: string} = {};
        
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setErrors({});
        
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    router.push('/dashboard');
                },
                onError: (error: any) => {
                    if (error?.response?.status === 401) {
                        setErrors({ general: 'Invalid email or password' });
                    } else {
                        setErrors({ general: 'Login failed. Please try again.' });
                    }
                }
            }
        );
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
                        <div className="bg-blue-600 p-3 rounded-full">
                            <FolderOpen className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-gray-600">
                        Sign in to your account to continue
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

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
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

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your password"
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

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => router.push('/register')}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
