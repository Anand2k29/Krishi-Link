import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import { useApp } from './context/AppContext';
import FarmerCalculator from './components/FarmerCalculator';
import MinistryDashboard from './components/MinistryDashboard';
import DriverMatcher from './components/DriverMatcher';
import FarmerRegistration from './components/FarmerRegistration';
import DriverRegistration from './components/DriverRegistration';
import { Sprout, Tractor, Building2, Truck, Menu, X, LogIn, LogOut, Shield, Play, Sparkles, LayoutDashboard } from 'lucide-react';
import { cn } from './lib/utils';
import GovernmentSchemes from './components/GovernmentSchemes';
import FarmerStories from './components/FarmerStories';
import B2BOrders from './components/B2BOrders';
import SponsoredContent from './components/SponsoredContent';
import B2BTracking from './components/B2BTracking';

function App() {
  const { userRole, logout, farmerProfile, driverProfile, language, setLanguage, t } = useApp();
  const [currentView, setCurrentView] = useState('farmer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWelcomeBackPopup, setShowWelcomeBackPopup] = useState(false);

  useEffect(() => {
    if (userRole === 'farmer' && farmerProfile?.loginCount === 2) {
      const hasSeenPopup = sessionStorage.getItem('krishi_seen_welcome_popup');
      if (!hasSeenPopup) {
        setShowWelcomeBackPopup(true);
        sessionStorage.setItem('krishi_seen_welcome_popup', 'true');
      }
    }
  }, [userRole, farmerProfile]);

  useEffect(() => {
    if (userRole === 'farmer') setCurrentView('farmer');
    if (userRole === 'driver') setCurrentView('driver');
    if (userRole === 'admin') setCurrentView('ministry');
    if (userRole === 'buyer') setCurrentView('b2b-orders');
  }, [userRole]);

  const renderView = () => {
    switch (currentView) {
      case 'farmer':
        return farmerProfile ? <FarmerCalculator /> : <FarmerRegistration />;
      case 'ministry':
        return <MinistryDashboard />;
      case 'driver':
        return driverProfile ? <DriverMatcher /> : <DriverRegistration />;
      case 'govt-schemes':
        return (
          <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GovernmentSchemes />
          </div>
        );
      case 'stories':
        return (
          <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FarmerStories />
          </div>
        );
      case 'b2b-orders':
        return (
          <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <B2BOrders />
          </div>
        );
      case 'b2b-tracking':
        return (
          <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <B2BTracking />
          </div>
        );
      case 'sponsored':
        return (
          <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SponsoredContent />
          </div>
        );
      default:
        return <FarmerCalculator />;
    }
  };

  const allNavItems = [
    { id: 'farmer', label: t('farmer'), icon: Tractor, roles: ['farmer'] },
    { id: 'govt-schemes', label: t('schemes'), icon: Shield, roles: ['farmer'] },
    { id: 'stories', label: t('stories'), icon: Play, roles: ['farmer'] },
    { id: 'b2b-orders', label: 'B2B Wholesale', icon: Building2, roles: ['buyer'] },
    { id: 'b2b-tracking', label: 'B2B Track', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'sponsored', label: 'Highlights', icon: Sparkles, roles: ['farmer'] },
    { id: 'ministry', label: t('ministry'), icon: Building2, roles: ['admin'] },
    { id: 'driver', label: t('driver'), icon: Truck, roles: ['driver'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

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

              {/* Language Toggle */}
              {currentView !== 'b2b-orders' && currentView !== 'b2b-tracking' && (
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-all border border-emerald-100"
                >
                  {language === 'en' ? 'हिन्दी' : 'English'}
                </button>
              )}

              <button
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
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
            <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'hi' : 'en');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg text-base font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-3" />
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {t('logout')}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col">
        {renderView()}
      </main>

      {/* Welcome Back Popup */}
      <AnimatePresence>
        {showWelcomeBackPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWelcomeBackPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full border border-emerald-100"
            >
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white text-center">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <Sparkles className="w-8 h-8 text-emerald-100 fill-emerald-100" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t('welcome')} Back!</h3>
                <p className="text-emerald-50 opacity-90 text-sm">
                  We're glad to see you again! Check out the new **Success Stories** tab to learn from fellow farmers.
                </p>
              </div>
              <div className="p-6 bg-white space-y-3">
                <button
                  onClick={() => {
                    setCurrentView('stories');
                    setShowWelcomeBackPopup(false);
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md transform active:scale-95"
                >
                  Explore Stories
                </button>
                <button
                  onClick={() => setShowWelcomeBackPopup(false)}
                  className="w-full py-2 bg-gray-50 text-gray-500 rounded-xl font-medium hover:bg-gray-100 transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2026 Krishi-Link. Connecting Farmers & Logistics.</p>
      </footer>
    </div>
  );
}

export default App;
