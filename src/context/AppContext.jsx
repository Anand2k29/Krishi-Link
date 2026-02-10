import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Global State
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);
    const [liveRequests, setLiveRequests] = useState([]);

    // activeDrivers is now derived from 'drivers' list in the value object

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
        // Since activeDrivers is now derived, we should ideally update a driver's status here if we want to simulate.
        // For now, removing the broken setActiveDrivers call.

        // simulation code removed for stability
        /* 
        setActiveDrivers((prev) => Math.max(0, prev - 1));
        setTimeout(() => {
            setActiveDrivers((prev) => prev + 1);
        }, 10000); 
        */
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

    // Derived state for active drivers (Available or On Delivery)
    // We can't easily derive this if 'activeDrivers' was separate. 
    // Let's replace the separate 'activeDrivers' state with a derived one for the dashboard to use.
    // But 'activeDrivers' variable is exposed. I will update it to be derived.

    const activeDriversCount = drivers.filter(d => d.status !== 'Offline').length;

    useEffect(() => {
        localStorage.setItem('krishi_drivers', JSON.stringify(drivers));
    }, [drivers]);

    const registerDriver = (name, password, vehicleNumber) => {
        const existingDriver = drivers.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (existingDriver) {
            return { success: false, message: 'Driver already exists' };
        }
        // Default status is 'Available' upon registration
        const newDriver = { name, password, vehicleNumber, status: 'Available' };
        setDrivers(prev => [...prev, newDriver]);
        setDriverProfile(newDriver);
        return { success: true };
    };

    const updateDriverStatus = (driverName, newStatus) => {
        setDrivers(prev => prev.map(d =>
            d.name === driverName ? { ...d, status: newStatus } : d
        ));
        // Also update profile if it matches
        if (driverProfile?.name === driverName) {
            setDriverProfile(prev => ({ ...prev, status: newStatus }));
        }
    };

    const loginDriver = (name, password) => {
        const driver = drivers.find(d => d.name.toLowerCase() === name.toLowerCase() && d.password === password);
        if (driver) {
            // Ensure status is present, default to Available if missing (legacy data)
            const driverWithStatus = { ...driver, status: driver.status || 'Available' };
            setDriverProfile(driverWithStatus);
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
        // Update driver status to 'On Delivery'
        updateDriverStatus(driverName, 'On Delivery');
    };

    const completeRequest = (id) => {
        // Find request to get driver name (optional, but good for completeness if we had it)
        // For now, we assume the current driver is completing it.
        setLiveRequests((prev) => prev.map((req) =>
            req.id === id ? { ...req, status: 'Completed', completedAt: new Date().toISOString() } : req
        ));
        // We might want to set driver back to 'Available' here, strictly speaking.
        // But let's let them do it manually or assume they are ready for next.
        // Let's set back to 'Available' for better UX.
        if (driverProfile) {
            updateDriverStatus(driverProfile.name, 'Available');
        }
    };

    const value = {
        totalFarmers,
        totalSavings,
        totalCO2,
        liveRequests,
        activeDrivers: activeDriversCount, // Exposing derived count
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
        updateDriverStatus, // Exposed
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
