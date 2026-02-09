import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Global State
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);
    const [liveRequests, setLiveRequests] = useState([]);

    const [activeDrivers, setActiveDrivers] = useState(12); // Starting with a base number of drivers

    // Mock initial data or effects can be added here if needed
    // For now, we start with 0 as requested.

    const addRequest = (requestData) => {
        // requestData expected structure: 
        // { id, weight, distance, standardPrice, krishiPrice, savings, co2, timestamp }

        setLiveRequests((prev) => [requestData, ...prev]);
        setTotalFarmers((prev) => prev + 1);
        setTotalSavings((prev) => prev + requestData.savings);
        setTotalCO2((prev) => prev + requestData.co2);

        // Simulate driver assignment affecting availability
        setActiveDrivers((prev) => Math.max(0, prev - 1));

        // Simulate driver becoming available again after some time
        setTimeout(() => {
            setActiveDrivers((prev) => prev + 1);
        }, 10000); // 10 seconds for demo purposes
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
        const newUser = { name, password };
        setUsers(prev => [...prev, newUser]);
        setFarmerProfile(newUser);
        return { success: true };
    };

    const loginFarmer = (name, password) => {
        const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
        if (user) {
            setFarmerProfile(user);
            return { success: true };
        }
        return { success: false, message: 'Invalid name or password' };
    };

    // This 'login' function is now a placeholder or can be removed if only farmer login is needed.
    // Keeping it for now as it was in the original context, but its functionality is limited.
    const [userRole, setUserRole] = useState(null); // 'farmer', 'driver', 'admin', or null
    const [driverProfile, setDriverProfile] = useState(() => {
        const savedSession = localStorage.getItem('krishi_current_driver');
        return savedSession ? JSON.parse(savedSession) : null;
    });

    const [drivers, setDrivers] = useState(() => {
        const savedDrivers = localStorage.getItem('krishi_drivers');
        return savedDrivers ? JSON.parse(savedDrivers) : [];
    });

    useEffect(() => {
        if (driverProfile) {
            localStorage.setItem('krishi_current_driver', JSON.stringify(driverProfile));
        } else {
            localStorage.removeItem('krishi_current_driver');
        }
    }, [driverProfile]);

    useEffect(() => {
        localStorage.setItem('krishi_drivers', JSON.stringify(drivers));
    }, [drivers]);

    const registerDriver = (name, password, vehicleNumber) => {
        const existingDriver = drivers.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (existingDriver) {
            return { success: false, message: 'Driver already exists' };
        }
        const newDriver = { name, password, vehicleNumber };
        setDrivers(prev => [...prev, newDriver]);
        setDriverProfile(newDriver);
        return { success: true };
    };

    const loginDriver = (name, password) => {
        const driver = drivers.find(d => d.name.toLowerCase() === name.toLowerCase() && d.password === password);
        if (driver) {
            setDriverProfile(driver);
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const login = (role) => {
        setUserRole(role);
    };

    const logout = () => {
        setUserRole(null); // Clear userRole if it's still being used
        setFarmerProfile(null);
        setDriverProfile(null);
    };

    const acceptRequest = (id, driverName) => {
        setLiveRequests((prev) => prev.map((req) =>
            req.id === id ? { ...req, status: 'Accepted', driverName: driverName, acceptedAt: new Date().toISOString() } : req
        ));
    };

    const completeRequest = (id) => {
        setLiveRequests((prev) => prev.map((req) =>
            req.id === id ? { ...req, status: 'Completed', completedAt: new Date().toISOString() } : req
        ));
    };

    const value = {
        totalFarmers,
        totalSavings,
        totalCO2,
        liveRequests,
        activeDrivers,
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
        users,
        drivers,
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
