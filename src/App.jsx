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
import B2BMarketplace from './components/B2BMarketplace';
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
      case 'b2b-marketplace':
        return (
          <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <B2BMarketplace />
          </div>
        );
      default:
        return <FarmerCalculator />;
    }
  };

  const allNavItems = [
    { id: 'farmer', label: t('farmer'), icon: Tractor, roles: ['farmer'] },
    { id: 'b2b-marketplace', label: 'B2B Quotes', icon: Building2, roles: ['farmer'] },
    { id: 'govt-schemes', label: t('schemes'), icon: Shield, roles: ['farmer'] },
    { id: 'stories', label: t('stories'), icon: Play, roles: ['farmer'] },
    { id: 'b2b-orders', label: 'B2B Wholesale', icon: Building2, roles: ['buyer'] },
    { id: 'b2b-tracking', label: 'B2B Track', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'sponsored', label: 'Highlights', icon: Sparkles, roles: ['farmer'] },
    { id: 'ministry', label: t('ministry'), icon: Building2, roles: ['admin'] },
    { id: 'driver', label: t('driver'), icon: Truck, roles: ['driver'] },
  ];

  // Strict Auth Check: Ensure user is fully authenticated before showing Nav or Dashboard
  const isAuthenticated =
    (userRole === 'farmer' && farmerProfile) ||
    (userRole === 'driver' && driverProfile) ||
    (userRole === 'buyer' && localStorage.getItem('krishi_b2b_buyer')) ||
    (userRole === 'admin'); // Admin usually has a simpler flow for now, or assume auth

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  if (!userRole) {
    return <Login />;
  }

  // If role is selected but not authenticated (e.g. clicked "Farmer" but didn't enter password)
  // Force them to the registration/login view and HIDE navigation
  const showNavigation = isAuthenticated;

  // Force strict view if not authenticated
  const effectiveView = isAuthenticated ? currentView : (userRole === 'farmer' ? 'farmer' : userRole === 'driver' ? 'driver' : userRole === 'buyer' ? 'b2b-orders' : currentView);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${userRole === 'driver' ? 'bg-slate-50' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
      {/* Navigation Bar - ONLY VISIBLE IF AUTHENTICATED */}
      {showNavigation && (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('farmer')}>
                <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
                  <Sprout size={24} />
                </div>
                <span className="ml-3 text-xl font-black text-gray-800 tracking-tight">
                  Krishi<span className="text-emerald-600">-Link</span>
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all relative group",
                      currentView === item.id
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-500 hover:text-emerald-600 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg mr-2 transition-colors",
                      currentView === item.id ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                    )}>
                      <item.icon size={18} />
                    </div>
                    {item.label}
                    {currentView === item.id && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Right Actions */}
              <div className="hidden md:flex items-center space-x-3">
                {(userRole === 'farmer' || userRole === 'admin') && (
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={16} className="text-yellow-500" />
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
      )}

      {/* Main Content */}
      <main className={`${showNavigation ? 'pt-24' : 'pt-0'} pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col`}>
        {(() => {
          // Redefine render logic with effectiveView
          switch (effectiveView) {
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
              // If buyer is not authenticated, showing B2BOrders might be okay IF B2BOrders handles it, 
              // but we forced effectiveView to something else if not authenticated above?
              // actually effectiveView logic for buyer was: userRole === 'buyer' ? 'b2b-orders' : currentView
              // Wait, if not authenticated, we want to show Login?
              // The App.jsx structure assumes "FarmerRegistration" is the login page for Farmers.
              // For Buyers, "B2BOrders" contains the login? NO, Login.jsx contained B2B Login.
              // If userRole is 'buyer' but not authenticated, this should show Login.jsx?
              // Actually Login.jsx sets role to 'buyer' only AFTER authentication for B2B.
              // So if userRole is 'buyer', they are already authenticated by definition of Login.jsx.
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
            case 'b2b-marketplace':
              return (
                <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <B2BMarketplace />
                </div>
              );
            default:
              return <FarmerCalculator />;
          }
        })()}
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
