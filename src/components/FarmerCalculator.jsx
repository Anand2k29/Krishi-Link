import React, { useState, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { useApp } from '../context/AppContext';
import { Leaf, IndianRupee, Truck, ArrowRight, MapPin, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

const VILLAGES = ['Rampur', 'Kishangarh', 'Badlapur', 'Sonarpur', 'Madhopur', 'Begampur', 'Chandpur', 'Dharmapur', 'Lakshmanpur'];
const MANDIS = ['Azadpur Mandi', 'Ghazipur Mandi', 'Okhla Mandi', 'Keshopur Mandi'];

export default function FarmerCalculator() {
    const { addRequest, farmerProfile } = useApp();
    const [weight, setWeight] = useState(200);
    const [distance, setDistance] = useState(50);
    const [sourceVillage, setSourceVillage] = useState(VILLAGES[0]);
    const [targetMandi, setTargetMandi] = useState(MANDIS[0]);

    const [isBooked, setIsBooked] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    // Constants
    const RATE_PER_KM = 15;
    const DISCOUNT_FACTOR = 0.6; // 40% discount
    const CO2_PER_KM = 0.12;

    // Real-time calculations
    const standardPrice = useMemo(() => distance * RATE_PER_KM, [distance]);
    const krishiPrice = useMemo(() => standardPrice * DISCOUNT_FACTOR, [standardPrice]);
    const savings = useMemo(() => standardPrice - krishiPrice, [standardPrice, krishiPrice]);
    const co2Saved = useMemo(() => distance * CO2_PER_KM, [distance]);

    const handleBook = () => {
        const requestData = {
            id: Date.now(),
            farmerName: farmerProfile?.name || 'Unknown Farmer',
            sourceVillage,
            targetMandi,
            weight,
            distance,
            standardPrice,
            krishiPrice,
            savings,
            co2: co2Saved,
            timestamp: new Date().toISOString(),
            status: 'Pending',
        };
        addRequest(requestData);
        setIsBooked(true);
        setBookingDetails(requestData);

        // Reset booking status after animation
        setTimeout(() => {
            setIsBooked(false);
            // Optionally reset form or keep it
        }, 2000);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="glass-card p-6 md:p-8 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Truck className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-gray-800">Get Quote</h2>
                    </div>
                    {farmerProfile && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Welcome,</p>
                            <p className="font-semibold text-emerald-700">{farmerProfile.name}</p>
                        </div>
                    )}
                </div>

                {/* Input Controls */}
                <div className="space-y-6">
                    {/* Location Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> From Village
                            </label>
                            <select
                                value={sourceVillage}
                                onChange={(e) => setSourceVillage(e.target.value)}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {VILLAGES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center">
                                <Navigation className="w-3 h-3 mr-1" /> To Mandi
                            </label>
                            <select
                                value={targetMandi}
                                onChange={(e) => setTargetMandi(e.target.value)}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {MANDIS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Weight */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600">Load Weight</label>
                            <span className="font-bold text-emerald-600">{weight} kg</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    {/* Distance */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600">Distance</label>
                            <span className="font-bold text-blue-600">{distance} km</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="500"
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {/* Visual Output */}
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-gray-500">Standard Price</span>
                        <span className="text-lg font-semibold text-red-400 line-through">
                            ₹{standardPrice.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 ring-1 ring-emerald-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-emerald-800 font-medium">Krishi Link</span>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">
                            ₹{krishiPrice.toLocaleString()}
                        </span>
                    </div>

                    {/* Savings Badge */}
                    <div className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
                        savings > 500 ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-gray-100 text-gray-600"
                    )}>
                        <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4" />
                            <span className="text-sm font-medium">You Save</span>
                        </div>
                        <span className="font-bold">₹{savings.toLocaleString()}</span>
                    </div>

                    {/* CO2 Saved */}
                    <div className="flex items-center justify-center space-x-2 text-green-600 text-sm mt-2">
                        <Leaf className="w-4 h-4" />
                        <span>Matches decrease CO2 by <b>{co2Saved.toFixed(1)} kg</b></span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleBook}
                    disabled={isBooked}
                    className={cn(
                        "w-full mt-6 py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]",
                        isBooked ? "bg-emerald-700 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    )}
                >
                    {isBooked ? (
                        <span className="flex items-center justify-center">
                            Request Sent!
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            Book Now <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                    )}
                </button>
            </div>

            {/* Booking Receipt with QR Code */}
            {bookingDetails && (
                <div className="glass-card p-6 bg-white animate-in slide-in-from-bottom duration-500">
                    <div className="text-center space-y-4">
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold inline-block">
                            Booking Confirmed
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Scan to Verify</h3>
                        <div className="flex justify-center p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                            <QRCode
                                value={JSON.stringify({
                                    id: bookingDetails.id,
                                    price: bookingDetails.krishiPrice,
                                    weight: bookingDetails.weight
                                })}
                                size={128}
                            />
                        </div>
                        <p className="text-xs text-gray-400">Booking ID: {bookingDetails.id}</p>

                        <div className="border-t border-gray-100 pt-4 mt-4 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Village:</span>
                                <span className="font-medium">{bookingDetails.sourceVillage}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Mandi:</span>
                                <span className="font-medium">{bookingDetails.targetMandi}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
