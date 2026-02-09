import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Package, IndianRupee, Radar, Navigation, QrCode, User, ScanLine } from 'lucide-react';
import { cn } from '../lib/utils';
import QRScanner from './QRScanner';

export default function DriverMatcher() {
    const { liveRequests, acceptRequest, driverProfile } = useApp();
    const [deadMileMode, setDeadMileMode] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    // Calculate potential earnings from all available requests
    const availableRequests = liveRequests.filter(req => req.status === 'Pending');
    const potentialEarnings = availableRequests.reduce((acc, req) => acc + req.krishiPrice, 0);

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome, {driverProfile?.name || 'Driver'}
                    </h2>
                    <p className="text-gray-500">
                        Vehicle: {driverProfile?.vehicleNumber || 'N/A'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-emerald-700 transition-all"
                    >
                        <ScanLine className="w-5 h-5 mr-2" />
                        Verify Booking
                    </button>
                    <button
                        onClick={() => setDeadMileMode(!deadMileMode)}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                            deadMileMode ? "bg-emerald-500" : "bg-gray-200"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                deadMileMode ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Potential Earnings Banner */}
                {availableRequests.length > 0 && (
                    <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex justify-between items-center animate-pulse-slow">
                        <div className="flex items-center space-x-2">
                            <IndianRupee />
                            <span className="font-bold text-lg">Potential Earnings Available</span>
                        </div>
                        <span className="text-2xl font-bold">₹{potentialEarnings.toLocaleString()}</span>
                    </div>
                )}

                {availableRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        >
                            <Radar className="w-16 h-16 text-emerald-500" />
                        </motion.div>
                        <p className="mt-4 text-xl font-medium text-emerald-600 animate-pulse">
                            Scanning for loads...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">Checking 50km radius</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn(
                                    "glass-card p-5 hover:shadow-xl transition-all border-l-4 relative overflow-hidden group",
                                    deadMileMode ? "border-emerald-500 bg-emerald-50/30" : "border-gray-300"
                                )}
                            >
                                {deadMileMode && (
                                    <div className="absolute top-0 right-0 p-2 bg-emerald-100 rounded-bl-xl text-xs font-bold text-emerald-700">
                                        MATCH FOUND
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="bg-gray-100 p-1 rounded-full">
                                                <User className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">{req.farmerName}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 flex items-center">
                                            <Package className="w-4 h-4 mr-2 text-gray-500" /> {req.weight} kg Load
                                        </h3>
                                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                                            <p className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1 text-emerald-500" />
                                                <span className="font-medium text-gray-700">{req.sourceVillage}</span>
                                                <span className="mx-1 text-gray-400">→</span>
                                                <span className="font-medium text-gray-700">{req.targetMandi}</span>
                                            </p>
                                            <p className="flex items-center">
                                                <Navigation className="w-3 h-3 mr-1" /> {req.distance} km trip
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div>
                                        <span className="text-xs text-gray-400 block">Market Rate</span>
                                        <span className="text-red-400 line-through text-sm">₹{req.standardPrice}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-emerald-600 font-bold block">YOUR EARNINGS</span>
                                        <span className="text-2xl font-bold text-emerald-600">₹{req.krishiPrice}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => acceptRequest(req.id)}
                                    className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
                                >
                                    Accept Load
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {
                showScanner && (
                    <QRScanner onClose={() => setShowScanner(false)} />
                )
            }
        </div >
    );
}

function RequestCard({ req, deadMileMode, onAction, actionLabel, actionColor }) {
    return (
        <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
                "glass-card p-5 hover:shadow-xl transition-all border-l-4 relative overflow-hidden group",
                deadMileMode ? "border-emerald-500 bg-emerald-50/30" : "border-gray-300"
            )}
        >
            {deadMileMode && (
                <div className="absolute top-0 right-0 p-2 bg-emerald-100 rounded-bl-xl text-xs font-bold text-emerald-700">
                    MATCH FOUND
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="bg-gray-100 p-1 rounded-full">
                            <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{req.farmerName}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-500" /> {req.weight} kg Load
                    </h3>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <p className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-emerald-500" />
                            <span className="font-medium text-gray-700">{req.sourceVillage}</span>
                            <span className="mx-1 text-gray-400">→</span>
                            <span className="font-medium text-gray-700">{req.targetMandi}</span>
                        </p>
                        <p className="flex items-center">
                            <Navigation className="w-3 h-3 mr-1" /> {req.distance} km trip
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div>
                    <span className="text-xs text-gray-400 block">Market Rate</span>
                    <span className="text-red-400 line-through text-sm">₹{req.standardPrice}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-emerald-600 font-bold block">YOUR EARNINGS</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{req.krishiPrice}</span>
                </div>
            </div>
            <button
                onClick={onAction}
                className={cn("w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors text-white shadow-md active:scale-95", actionColor)}
            >
                {actionLabel}
            </button>
        </motion.div>
    );
}


