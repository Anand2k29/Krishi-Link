import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, MapPin, ArrowRight, Sprout, Lock, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FarmerRegistration() {
    const { registerFarmer, loginFarmer } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !password.trim()) {
            setError('Please enter both name and password');
            return;
        }

        let result;
        if (isLoginMode) {
            result = loginFarmer(name, password);
        } else {
            result = registerFarmer(name, password);
        }

        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isLoginMode ? (
                            <LogIn className="w-8 h-8 text-emerald-600" />
                        ) : (
                            <User className="w-8 h-8 text-emerald-600" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLoginMode ? 'Welcome Back' : 'Join Krishi-Link'}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {isLoginMode
                            ? 'Enter your credentials to continue'
                            : 'Register to start booking loads'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Sprout className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium mt-1 text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                    >
                        {isLoginMode ? 'Login' : 'continue'} <ArrowRight className="ml-2 w-5 h-5" />
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                            }}
                            className="text-sm text-emerald-600 font-medium hover:text-emerald-700 underline"
                        >
                            {isLoginMode
                                ? "New here? Create an account"
                                : "Already registered? Login here"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
