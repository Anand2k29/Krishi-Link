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
        Village: 'Village',
        Mandi: 'Mandi',
        'Search crops in': 'Search crops in',
        Rampur: 'Rampur',
        Kishangarh: 'Kishangarh',
        Badlapur: 'Badlapur',
        Sonarpur: 'Sonarpur',
        Madhopur: 'Madhopur',
        Begampur: 'Begampur',
        Chandpur: 'Chandpur',
        Dharmapur: 'Dharmapur',
        Lakshmanpur: 'Lakshmanpur',
        'Azadpur Mandi': 'Azadpur Mandi',
        'Ghazipur Mandi': 'Ghazipur Mandi',
        'Okhla Mandi': 'Okhla Mandi',
        'Keshopur Mandi': 'Keshopur Mandi',
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
        Village: 'गांव',
        Mandi: 'मंडी',
        'Search crops in': 'फसलों की तलाश करें',
        Rampur: 'रामपुर',
        Kishangarh: 'किशनगढ़',
        Badlapur: 'बदलापुर',
        Sonarpur: 'सोनारपुर',
        Madhopur: 'माधोपुर',
        Begampur: 'बेगमपुर',
        Chandpur: 'चांदपुर',
        Dharmapur: 'धर्मपुर',
        Lakshmanpur: 'लक्ष्मणपुर',
        'Azadpur Mandi': 'आज़ादपुर मंडी',
        'Ghazipur Mandi': 'गाजीपुर मंडी',
        'Okhla Mandi': 'ओखला मंडी',
        'Keshopur Mandi': 'केशोपुर मंडी',
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

    const registerFarmerWithOAuth = (oauthData) => {
        const existingUser = users.find(u => u.email === oauthData.email || u.uid === oauthData.uid);
        if (existingUser) {
            // Update existing user with new data
            const updatedUser = { ...existingUser, ...oauthData, loginCount: (existingUser.loginCount || 0) + 1 };
            const updatedUsers = users.map(u => u.email === oauthData.email || u.uid === oauthData.uid ? updatedUser : u);
            setUsers(updatedUsers);
            setFarmerProfile(updatedUser);
            return { success: true };
        }
        const newUser = { ...oauthData, loginCount: 1, authMethod: 'google' };
        setUsers(prev => [...prev, newUser]);
        setFarmerProfile(newUser);
        return { success: true };
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

    const registerDriverWithOAuth = (oauthData) => {
        const existingDriver = drivers.find(d => d.email === oauthData.email || d.uid === oauthData.uid);
        if (existingDriver) {
            // Update existing driver with new data
            const updatedDriver = { ...existingDriver, ...oauthData, stats: existingDriver.stats || { jobs: 0, co2Saved: 0 } };
            const updatedDrivers = drivers.map(d => d.email === oauthData.email || d.uid === oauthData.uid ? updatedDriver : d);
            setDrivers(updatedDrivers);
            setDriverProfile(updatedDriver);
            return { success: true };
        }
        const newDriver = { ...oauthData, status: 'Available', stats: { jobs: 0, co2Saved: 0 }, authMethod: 'google' };
        setDrivers(prev => [...prev, newDriver]);
        setDriverProfile(newDriver);
        return { success: true };
    };

    const login = (role) => {
        // Clear conflicting profiles when switching roles
        if (role !== 'farmer') setFarmerProfile(null);
        if (role !== 'driver') setDriverProfile(null);

        // Ensure proper clean up of localStorage for other roles if necessary
        // but for now, just clearing state is enough for the session.
        setUserRole(role);
    };

    const logout = () => {
        setUserRole(null);
        setFarmerProfile(null);
        setDriverProfile(null);
    };

    // B2B Buyers State
    const [b2bBuyers, setB2BBuyers] = useState(() => {
        const savedBuyers = localStorage.getItem('krishi_b2b_buyers');
        return savedBuyers ? JSON.parse(savedBuyers) : [];
    });

    useEffect(() => {
        localStorage.setItem('krishi_b2b_buyers', JSON.stringify(b2bBuyers));
    }, [b2bBuyers]);

    const registerB2BWithOAuth = (oauthData) => {
        const existingBuyer = b2bBuyers.find(b => b.email === oauthData.email || b.uid === oauthData.uid);
        if (existingBuyer) {
            // Update existing buyer with new data
            const updatedBuyer = { ...existingBuyer, ...oauthData, loginCount: (existingBuyer.loginCount || 0) + 1 };
            const updatedBuyers = b2bBuyers.map(b => b.email === oauthData.email || b.uid === oauthData.uid ? updatedBuyer : b);
            setB2BBuyers(updatedBuyers);
            return { success: true };
        }
        const newBuyer = { ...oauthData, loginCount: 1, authMethod: 'google', registeredAt: new Date().toISOString() };
        setB2BBuyers(prev => [...prev, newBuyer]);
        return { success: true };
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

    const [b2bOrders, setB2BOrders] = useState(() => {
        const saved = localStorage.getItem('krishi_b2b_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [b2bQuotes, setB2BQuotes] = useState(() => {
        const saved = localStorage.getItem('krishi_b2b_quotes');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('krishi_b2b_orders', JSON.stringify(b2bOrders));
    }, [b2bOrders]);

    useEffect(() => {
        localStorage.setItem('krishi_b2b_quotes', JSON.stringify(b2bQuotes));
    }, [b2bQuotes]);

    const addB2BOrder = (order) => {
        const newOrder = {
            ...order,
            id: `B2B-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString(),
            status: 'Processing',
            escrowStatus: 'In-Escrow',
            progress: 10
        };
        setB2BOrders(prev => [newOrder, ...prev]);
    };

    const addB2BQuote = (quote) => {
        const newQuote = {
            ...quote,
            id: `QT-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString(),
            status: 'Pending'
        };
        setB2BQuotes(prev => [newQuote, ...prev]);
    };

    const submitQuoteResponse = (response) => {
        setB2BQuotes(prev => prev.map(quote =>
            quote.id === response.quoteId
                ? {
                    ...quote,
                    status: 'Responded',
                    yourOffer: response.pricePerTon,
                    farmerResponse: response,
                    respondedAt: new Date().toISOString()
                }
                : quote
        ));
    };

    const approveB2BQuote = (quoteId) => {
        setB2BQuotes(prev => prev.map(quote =>
            quote.id === quoteId
                ? { ...quote, status: 'BuyerApproved', approvedAt: new Date().toISOString() }
                : quote
        ));
    };

    const confirmB2BOrder = (quoteId) => {
        const quote = b2bQuotes.find(q => q.id === quoteId);
        if (!quote) return;

        setB2BQuotes(prev => prev.map(q =>
            q.id === quoteId
                ? { ...q, status: 'Confirmed', confirmedAt: new Date().toISOString() }
                : q
        ));

        // Create Delivery Request ONLY after final confirmation
        createB2BDelivery({
            commodity: quote.commodity,
            quantity: parseFloat(quote.farmerResponse?.availableQuantity || quote.quantity),
            ratePerTon: parseFloat(quote.yourOffer) * 0.1,
            source: quote.farmerResponse?.source || 'Farm Location',
            destination: quote.farmerResponse?.destination || 'B2B Buyer Location',
            timeline: quote.farmerResponse?.deliveryDays || quote.deadline,
            farmerName: quote.farmerName || 'Current Farmer',
            quoteId: quote.id
        });
    };

    // B2B Delivery Requests State
    const [b2bDeliveryRequests, setB2BDeliveryRequests] = useState(() => {
        const savedRequests = localStorage.getItem('krishi_b2b_deliveries');
        return savedRequests ? JSON.parse(savedRequests) : [];
    });

    useEffect(() => {
        localStorage.setItem('krishi_b2b_deliveries', JSON.stringify(b2bDeliveryRequests));
    }, [b2bDeliveryRequests]);

    const createB2BDelivery = (deliveryData) => {
        const newDelivery = {
            ...deliveryData,
            id: `B2BD-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString(),
            status: 'Pending',
            assignedDrivers: []
        };
        setB2BDeliveryRequests(prev => [newDelivery, ...prev]);
        return newDelivery;
    };

    const acceptB2BDelivery = ({ deliveryId, driverName, isSplit, splitData }) => {
        setB2BDeliveryRequests(prev => prev.map(delivery => {
            if (delivery.id === deliveryId) {
                if (isSplit && splitData) {
                    return {
                        ...delivery,
                        status: 'Accepted',
                        assignedDrivers: [
                            { ...splitData.driver1, acceptedAt: new Date().toISOString() },
                            { ...splitData.driver2, status: 'Pending' }
                        ]
                    };
                } else {
                    return {
                        ...delivery,
                        status: 'Accepted',
                        assignedDrivers: [{ name: driverName, percentage: 100, load: delivery.quantity, acceptedAt: new Date().toISOString() }]
                    };
                }
            }
            return delivery;
        }));
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
        registerFarmerWithOAuth,
        loginFarmer,
        driverProfile,
        registerDriver,
        registerDriverWithOAuth,
        loginDriver,
        completeRequest,
        updateDriverStatus,
        users,
        drivers,
        language,
        setLanguage,
        t,
        b2bOrders,
        b2bQuotes,
        addB2BOrder,
        addB2BQuote,
        submitQuoteResponse,
        approveB2BQuote,
        confirmB2BOrder,
        b2bBuyers,
        registerB2BWithOAuth,
        b2bDeliveryRequests,
        createB2BDelivery,
        acceptB2BDelivery
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
