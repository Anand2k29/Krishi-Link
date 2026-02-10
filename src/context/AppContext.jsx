import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const TRANSLATIONS = {
    en: {
        welcome: 'Welcome',
        logout: 'Logout',
        ministry: 'Ministry Login',
        farmer: 'Farmer',
        driver: 'Driver',
        getQuote: 'Get Quote',
        marketPrices: 'Market Prices',
        savings: 'You Save',
        standardPrice: 'Standard Price',
        krishiLink: 'Krishi Link',
        bookNow: 'Book Now',
        bookingConfirmed: 'Booking Confirmed',
        scanToVerify: 'Scan to Verify',
        weatherWarning: 'Weather Warning',
        heavyRain: 'Heavy rain predicted in your area soon. Plan your harvest transport accordingly.',
        sendWhatsApp: 'Send to WhatsApp',
        badges: 'My Badges',
        co2Warrior: 'CO2 Warrior',
        speedyDelivery: 'Speedy Delivery',
        stories: 'Stories',
        schemes: 'Schemes',
    },
    hi: {
        welcome: 'स्वागत है',
        logout: 'लॉगआउट',
        ministry: 'मंत्रालय लॉगिन',
        farmer: 'किसान',
        driver: 'ड्राइवर',
        getQuote: 'कोट प्राप्त करें',
        marketPrices: 'बाजार भाव',
        savings: 'आपकी बचत',
        standardPrice: 'मानक मूल्य',
        krishiLink: 'कृषि लिंक',
        bookNow: 'अभी बुक करें',
        bookingConfirmed: 'बुकिंग की पुष्टि हो गई',
        scanToVerify: 'सत्यापित करने के लिए स्कैन करें',
        weatherWarning: 'मौसम की चेतावनी',
        heavyRain: 'जल्द ही आपके क्षेत्र में भारी बारिश की संभावना है। अपनी फसल परिवहन की योजना तदनुसार बनाएं।',
        sendWhatsApp: 'व्हाट्सएप पर भेजें',
        badges: 'मेरे बैज',
        co2Warrior: 'CO2 वारियर',
        speedyDelivery: 'तेज़ डिलीवरी',
        stories: 'कहानियां',
        schemes: 'योजनाएं',
    }
};

export const AppProvider = ({ children }) => {
    // Global State
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);
    const [liveRequests, setLiveRequests] = useState([]);
    const [language, setLanguage] = useState(() => localStorage.getItem('krishi_lang') || 'en');

    const t = (key) => {
        return TRANSLATIONS[language][key] || key;
    };

    useEffect(() => {
        localStorage.setItem('krishi_lang', language);
    }, [language]);

    const addRequest = (requestData) => {
        setLiveRequests((prev) => [requestData, ...prev]);
        setTotalFarmers((prev) => prev + 1);
        setTotalSavings((prev) => prev + requestData.savings);
        setTotalCO2((prev) => prev + requestData.co2);
    };

    // Auth State
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('krishi_users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    const [farmerProfile, setFarmerProfile] = useState(() => {
        const savedSession = localStorage.getItem('krishi_current_farmer');
        return savedSession ? JSON.parse(savedSession) : null;
    });

    useEffect(() => {
        localStorage.setItem('krishi_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (farmerProfile) {
            localStorage.setItem('krishi_current_farmer', JSON.stringify(farmerProfile));
        } else {
            localStorage.removeItem('krishi_current_farmer');
        }
    }, [farmerProfile]);

    const registerFarmer = (name, password) => {
        const existingUser = users.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }
        const newUser = { name, password, loginCount: 1 };
        setUsers(prev => [...prev, newUser]);
        setFarmerProfile(newUser);
        return { success: true };
    };

    const loginFarmer = (name, password) => {
        const userIndex = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
        if (userIndex !== -1) {
            const updatedUser = { ...users[userIndex], loginCount: (users[userIndex].loginCount || 0) + 1 };
            const updatedUsers = [...users];
            updatedUsers[userIndex] = updatedUser;
            setUsers(updatedUsers);
            setFarmerProfile(updatedUser);
            return { success: true };
        }
        return { success: false, message: 'Invalid name or password' };
    };

    const [userRole, setUserRole] = useState(null);
    const [driverProfile, setDriverProfile] = useState(() => {
        const savedSession = localStorage.getItem('krishi_current_driver');
        return savedSession ? JSON.parse(savedSession) : null;
    });

    const [drivers, setDrivers] = useState(() => {
        const savedDrivers = localStorage.getItem('krishi_drivers');
        return savedDrivers ? JSON.parse(savedDrivers) : [];
    });

    const activeDriversCount = drivers.filter(d => d.status !== 'Offline').length;

    useEffect(() => {
        localStorage.setItem('krishi_drivers', JSON.stringify(drivers));
    }, [drivers]);

    const registerDriver = (name, password, vehicleNumber) => {
        const existingDriver = drivers.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (existingDriver) {
            return { success: false, message: 'Driver already exists' };
        }
        const newDriver = { name, password, vehicleNumber, status: 'Available', stats: { jobs: 0, co2Saved: 0 } };
        setDrivers(prev => [...prev, newDriver]);
        setDriverProfile(newDriver);
        return { success: true };
    };

    const updateDriverStatus = (driverName, newStatus) => {
        setDrivers(prev => prev.map(d =>
            d.name === driverName ? { ...d, status: newStatus } : d
        ));
        if (driverProfile?.name === driverName) {
            setDriverProfile(prev => ({ ...prev, status: newStatus }));
        }
    };

    const loginDriver = (name, password) => {
        const driver = drivers.find(d => d.name.toLowerCase() === name.toLowerCase() && d.password === password);
        if (driver) {
            const driverWithStatus = { ...driver, status: driver.status || 'Available', stats: driver.stats || { jobs: 0, co2Saved: 0 } };
            setDriverProfile(driverWithStatus);
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const login = (role) => {
        setUserRole(role);
    };

    const logout = () => {
        setUserRole(null);
        setFarmerProfile(null);
        setDriverProfile(null);
    };

    const acceptRequest = (id, driverName) => {
        setLiveRequests((prev) => prev.map((req) =>
            req.id === id ? { ...req, status: 'Accepted', driverName: driverName, acceptedAt: new Date().toISOString() } : req
        ));
        updateDriverStatus(driverName, 'On Delivery');
    };

    const completeRequest = (id) => {
        const req = liveRequests.find(r => r.id === id);
        setLiveRequests((prev) => prev.map((req) =>
            req.id === id ? { ...req, status: 'Completed', completedAt: new Date().toISOString() } : req
        ));

        if (driverProfile) {
            setDrivers(prev => prev.map(d =>
                d.name === driverProfile.name
                    ? { ...d, status: 'Available', stats: { ...d.stats, jobs: (d.stats?.jobs || 0) + 1, co2Saved: (d.stats?.co2Saved || 0) + (req?.co2 || 0) } }
                    : d
            ));
            setDriverProfile(prev => ({
                ...prev,
                status: 'Available',
                stats: { ...prev.stats, jobs: (prev.stats?.jobs || 0) + 1, co2Saved: (prev.stats?.co2Saved || 0) + (req?.co2 || 0) }
            }));
        }
    };

    const value = {
        totalFarmers,
        totalSavings,
        totalCO2,
        liveRequests,
        activeDrivers: activeDriversCount,
        addRequest,
        acceptRequest,
        userRole,
        login,
        logout,
        farmerProfile,
        registerFarmer,
        loginFarmer,
        driverProfile,
        registerDriver,
        loginDriver,
        completeRequest,
        updateDriverStatus,
        users,
        drivers,
        language,
        setLanguage,
        t,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
