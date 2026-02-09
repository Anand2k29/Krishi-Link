import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import { useApp } from './context/AppContext';
import FarmerCalculator from './components/FarmerCalculator';
import MinistryDashboard from './components/MinistryDashboard';
import DriverMatcher from './components/DriverMatcher';
import FarmerRegistration from './components/FarmerRegistration';
import DriverRegistration from './components/DriverRegistration';
import { Sprout, Tractor, Building2, Truck, Menu, X, LogIn, LogOut } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const { userRole, logout, farmerProfile, driverProfile } = useApp();
  const [currentView, setCurrentView] = useState('farmer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (userRole === 'farmer') setCurrentView('farmer');
    if (userRole === 'driver') setCurrentView('driver');
    if (userRole === 'admin') setCurrentView('ministry');
  }, [userRole]);

  const renderView = () => {
    switch (currentView) {
      case 'farmer':
        return farmerProfile ? <FarmerCalculator /> : <FarmerRegistration />;
      case 'ministry':
        return <MinistryDashboard />;
      case 'driver':
        return driverProfile ? <DriverMatcher /> : <DriverRegistration />;
      default:
        return <FarmerCalculator />;
    }
  };

  const allNavItems = [
    { id: 'farmer', label: 'Farmer Input', icon: Tractor, roles: ['farmer', 'admin'] },
    { id: 'ministry', label: 'Ministry Dashboard', icon: Building2, roles: ['admin'] },
    { id: 'driver', label: 'Driver Matcher', icon: Truck, roles: ['driver', 'admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  // Set initial view based on role if needed, or handle in useEffect
  // For simplicity, we can let the user click or default to the first available item.
  // Ideally, use useEffect to set currentView when userRole changes.

  if (!userRole) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-800 font-sans selection:bg-emerald-200">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('farmer')}>
              <div className="bg-emerald-600 p-2 rounded-lg text-white">
                <Sprout size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
                Krishi-Link
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    currentView === item.id
                      ? "bg-emerald-100 text-emerald-800 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 mx-4 p-2 space-y-1 absolute left-0 right-0 top-14 shadow-xl border border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  currentView === item.id
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-100 my-2 pt-2">
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2026 Krishi-Link. Connecting Farmers & Logistics.</p>
      </footer>
    </div>
  );
}

export default App;
