import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Truck, Building2, ArrowLeft, Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const { login } = useApp();
    const [showB2BForm, setShowB2BForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [password, setPassword] = useState('');

    const handleB2BSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth
        setTimeout(() => {
            login('buyer');
            setLoading(false);
        }, 1000);
    };

    if (showB2BForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
                <div className="glass-card w-full max-w-md p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-orange-100">
                    <button
                        onClick={() => setShowB2BForm(false)}
                        className="flex items-center text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    <div className="text-center space-y-2">
                        <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
                            <Building2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Organization Login</h2>
                        <p className="text-gray-500 text-sm">Access the B2B Wholesale Portal</p>
                    </div>

                    <form onSubmit={handleB2BSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Organization / Hotel Name</label>
                            <input
                                required
                                type="text"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                placeholder="e.g. Taj Hotels, ITC"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <button
                            disabled={loading}
                            className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In to Portal'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
            <div className="glass-card w-full max-w-md p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="space-y-4">
                    <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
                        <Sprout size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Krishi-Link</h1>
                    <p className="text-gray-500">Select your role to continue</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => login('farmer')}
                        className="w-full flex items-center p-4 rounded-xl border border-emerald-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                    >
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                            <Tractor size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-800">Farmer</h3>
                            <p className="text-xs text-gray-500">Calculate rates & book loads</p>
                        </div>
                    </button>

                    <button
                        onClick={() => login('driver')}
                        className="w-full flex items-center p-4 rounded-xl border border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all group"
                    >
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <Truck size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-800">Driver</h3>
                            <p className="text-xs text-gray-500">Find return loads & earnings</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowB2BForm(true)}
                        className="w-full flex items-center p-4 rounded-xl border border-orange-100 bg-white hover:bg-orange-50 hover:border-orange-200 transition-all group"
                    >
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600 group-hover:bg-orange-200 transition-colors">
                            <Building2 size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-800">B2B Buyer</h3>
                            <p className="text-xs text-gray-500">Organization Login for Hotels</p>
                        </div>
                    </button>

                    <button
                        onClick={() => login('admin')}
                        className="w-full flex items-center p-4 rounded-xl border border-purple-100 bg-white hover:bg-purple-50 hover:border-purple-200 transition-all group"
                    >
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-200 transition-colors">
                            <LayoutDashboard size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-800">Ministry Admin</h3>
                            <p className="text-xs text-gray-500">View dashboard & analytics</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

function LayoutDashboard({ size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
    );
}

function Tractor({ size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 4h9l1 7" />
            <path d="M4 11V4" />
            <path d="M8 10V4" />
            <path d="M18 5c-.6 0-1 .4-1 1v5.6" />
            <path d="m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1" />
            <circle cx="7" cy="15" r="3" />
            <circle cx="17" cy="15" r="3" />
        </svg>
    );
}
