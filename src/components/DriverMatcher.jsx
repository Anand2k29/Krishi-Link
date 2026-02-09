import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Package, IndianRupee, Radar, Navigation, QrCode, User, ScanLine } from 'lucide-react';
import { cn } from '../lib/utils';
import QRScanner from './QRScanner';

export default function DriverMatcher() {
    const { liveRequests, acceptRequest, completeRequest, driverProfile } = useApp();
    const [deadMileMode, setDeadMileMode] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [activeTab, setActiveTab] = useState('available');

    // Filter requests
    const availableRequests = liveRequests.filter(req => req.status === 'Pending');
    const myAcceptedRequests = liveRequests.filter(req => req.status === 'Accepted' && req.driverName === driverProfile?.name);
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

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('available')}
                    className={cn(
                        "pb-2 font-medium text-sm transition-colors relative",
                        activeTab === 'available' ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Available ({availableRequests.length})
                    {activeTab === 'available' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('my-loads')}
                    className={cn(
                        "pb-2 font-medium text-sm transition-colors relative",
                        activeTab === 'my-loads' ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Active ({myAcceptedRequests.length})
                    {activeTab === 'my-loads' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "pb-2 font-medium text-sm transition-colors relative",
                        activeTab === 'history' ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    History
                    {activeTab === 'history' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === 'available' && (
                    <>
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
                                    <RequestCard
                                        key={req.id}
                                        req={req}
                                        deadMileMode={deadMileMode}
                                        onAction={() => acceptRequest(req.id, driverProfile.name)}
                                        actionLabel="Accept Load"
                                        actionColor="bg-gray-900 hover:bg-gray-800"
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'my-loads' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myAcceptedRequests.length === 0 ? (
                            <p className="text-center text-gray-500 py-10 w-full col-span-2">No active jobs. Go pick one!</p>
                        ) : (
                            myAcceptedRequests.map((req) => (
                                <RequestCard
                                    key={req.id}
                                    req={req}
                                    deadMileMode={false}
                                    onAction={() => completeRequest(req.id)}
                                    actionLabel="Complete Delivery"
                                    actionColor="bg-emerald-600 hover:bg-emerald-700"
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Farmer</th>
                                        <th className="px-6 py-3 text-left">Route</th>
                                        <th className="px-6 py-3 text-left">Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {liveRequests.filter(req => req.status === 'Completed' && req.driverName === driverProfile?.name).map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {new Date(req.completedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.farmerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{req.sourceVillage} → {req.targetMandi}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{req.krishiPrice}</td>
                                        </tr>
                                    ))}
                                    {liveRequests.filter(req => req.status === 'Completed' && req.driverName === driverProfile?.name).length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No completed jobs yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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


