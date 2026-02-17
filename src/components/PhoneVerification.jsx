import React, { useState, useEffect, useRef } from 'react';
import { Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { initRecaptcha, sendOTP, verifyOTP } from '../services/authService';

export default function PhoneVerification({ onVerified, onError }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState('phone'); // 'phone', 'otp', 'verified'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [verificationId, setVerificationId] = useState(null);

    const otpInputs = useRef([]);
    const recaptchaContainerRef = useRef(null);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    useEffect(() => {
        // Initialize reCAPTCHA when component mounts
        if (recaptchaContainerRef.current && !window.recaptchaVerifier) {
            initRecaptcha('recaptcha-container');
        }
    }, []);

    const formatPhoneNumber = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Limit to 10 digits for Indian numbers
        return digits.slice(0, 10);
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        setError('');
    };

    const handleSendOTP = async () => {
        if (phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const fullPhoneNumber = `+91${phoneNumber}`;
            const recaptchaVerifier = initRecaptcha('recaptcha-container');

            const result = await sendOTP(fullPhoneNumber, recaptchaVerifier);

            if (result.success) {
                setVerificationId(result.verificationId);
                setStep('otp');
                setResendTimer(30);
            } else {
                setError(result.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits are entered
        if (newOtp.every(digit => digit !== '') && index === 5) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async (code = otp.join('')) => {
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyOTP(code);

            if (result.success) {
                setStep('verified');
                setTimeout(() => {
                    onVerified({
                        phoneNumber: `+91${phoneNumber}`,
                        verified: true,
                        user: result.user
                    });
                }, 1000);
            } else {
                setError(result.error || 'Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                otpInputs.current[0]?.focus();
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
            setOtp(['', '', '', '', '', '']);
            otpInputs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        setOtp(['', '', '', '', '', '']);
        setStep('phone');
        setError('');
    };

    if (step === 'verified') {
        return (
            <div className="text-center py-8 animate-in zoom-in duration-300">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Phone Verified!</h3>
                <p className="text-gray-500 mt-2">Your phone number has been verified successfully</p>
            </div>
        );
    }

    if (step === 'otp') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Enter OTP</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        We sent a code to +91 {phoneNumber}
                    </p>
                </div>

                <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => otpInputs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            disabled={loading}
                        />
                    ))}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="text-center space-y-3">
                    <button
                        type="button"
                        onClick={() => handleVerifyOTP()}
                        disabled={loading || otp.some(d => !d)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <div className="text-sm text-gray-500">
                        {resendTimer > 0 ? (
                            <span>Resend OTP in {resendTimer}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="text-blue-600 font-medium hover:text-blue-700 underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">+91</span>
                    </div>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        className="block w-full pl-20 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                        disabled={loading}
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || phoneNumber.length !== 10}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Sending...' : 'Send OTP'}
            </button>

            {/* reCAPTCHA container - invisible */}
            <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
        </div>
    );
}
