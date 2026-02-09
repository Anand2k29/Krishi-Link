import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Truck, Building2 } from 'lucide-react';

export default function Login() {
    const { login } = useApp();

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

                <div className="space-y-4">
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
                        onClick={() => login('admin')}
                        className="w-full flex items-center p-4 rounded-xl border border-purple-100 bg-white hover:bg-purple-50 hover:border-purple-200 transition-all group"
                    >
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-200 transition-colors">
                            <Building2 size={24} />
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
