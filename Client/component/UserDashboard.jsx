'use client'
import React, { useState, useEffect } from 'react';
import { CreditCard, Package, Database, DollarSign, TrendingUp, Calendar, X, AlertCircle, PlusCircle, User, BarChart2, Clock, Activity, ArrowRight, Info, Timer } from 'lucide-react';

// Animation Components
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
};

const CurrencyCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(easeOutQuart * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 2
      }).format(count)}
    </span>
  );
};

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    balance: 0,
    todayOrders: 0,
    todayGbSold: 0,
    todayRevenue: 0,
    recentTransactions: []
  });
  
  const [startAnimation, setStartAnimation] = useState(false);
  const [displayNotice, setDisplayNotice] = useState(true);
  
  // Network inventory state
  const [networkInventory, setNetworkInventory] = useState({
    mtn: { inStock: true, loading: true, lastChecked: null },
    airteltigo: { inStock: true, loading: true, lastChecked: null },
    telecel: { inStock: true, loading: true, lastChecked: null }
  });

  const viewAllOrders = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/orders';
    }
  };

  const goToTransactions = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/myorders';
    }
  };

  const goToTopup = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/topup';
    }
  };

  const goToNetwork = (network) => {
    const inventoryKey = network.toLowerCase();
    if (!networkInventory[inventoryKey]?.inStock) {
      alert(`${network.toUpperCase()} bundles are currently out of stock. Please try another network.`);
      return;
    }
    
    const routes = {
      'mtn': '/mtnup2u',
      'airteltigo': '/at-ishare',
      'telecel': '/TELECEL'
    };
    
    if (typeof window !== 'undefined') {
      window.location.href = routes[network] || '/';
    }
  };

  // Check inventory for all networks
  const checkNetworkInventory = async () => {
    const networks = [
      { key: 'mtn', apiName: 'YELLO' },
      { key: 'airteltigo', apiName: 'AT_PREMIUM' },
      { key: 'telecel', apiName: 'TELECEL' }
    ];

    for (const network of networks) {
      try {
        console.log(`🔍 Checking ${network.key.toUpperCase()} inventory...`);
        
        const response = await fetch(`https://api.datamartgh.shop/api/inventory/check/${network.apiName}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          const { inStock } = data.data;
          
          setNetworkInventory(prev => ({
            ...prev,
            [network.key]: {
              inStock,
              loading: false,
              lastChecked: new Date()
            }
          }));
          
          console.log(`✅ ${network.key.toUpperCase()} Inventory:`, inStock ? 'IN STOCK' : 'OUT OF STOCK');
        }
      } catch (error) {
        console.error(`❌ Failed to check ${network.key} inventory:`, error);
        
        setNetworkInventory(prev => ({
          ...prev,
          [network.key]: {
            inStock: false,
            loading: false,
            lastChecked: new Date()
          }
        }));
      }
    }
  };

  // Manual refresh handler
  const handleRefreshInventory = () => {
    setNetworkInventory(prev => ({
      mtn: { ...prev.mtn, loading: true },
      airteltigo: { ...prev.airteltigo, loading: true },
      telecel: { ...prev.telecel, loading: true }
    }));
    checkNetworkInventory();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) {
      window.location.href = '/SignUp';
      return;
    }

    const userData = JSON.parse(userDataStr);
    setUserName(userData.name || 'User');
    loadDashboard(userData.id);
    
    const noticeHidden = localStorage.getItem('dataDeliveryNoticeDismissed');
    if (noticeHidden === 'true') {
      setDisplayNotice(false);
    }

    checkNetworkInventory();
    
    const inventoryInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing network inventory...');
      checkNetworkInventory();
    }, 30000);
    
    return () => {
      clearInterval(inventoryInterval);
      console.log('🛑 Network inventory auto-refresh stopped');
    };
  }, []);

  const loadDashboard = async (userId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      const res = await fetch(`https://unlimiteddatagh.onrender.com/api/v1/data/user-dashboard/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await res.json();
      
      if (data.status === 'success') {
        const { userBalance, todayOrders } = data.data;
        
        setStats({
          balance: userBalance,
          todayOrders: todayOrders.count,
          todayGbSold: todayOrders.totalGbSold,
          todayRevenue: todayOrders.totalValue,
          recentTransactions: todayOrders.orders.map(order => ({
            id: order._id,
            customer: order.phoneNumber,
            method: order.method,
            amount: order.price,
            gb: formatDataSize(order.capacity),
            time: new Date(order.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            network: order.network
          }))
        });
        
        setIsLoading(false);
        setTimeout(() => setStartAnimation(true), 200);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setIsLoading(false);
    }
  };

  const formatDataSize = (capacity) => {
    if (capacity >= 1000) {
      return (capacity / 1000).toFixed(1);
    }
    return capacity;
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const hideNotice = () => {
    setDisplayNotice(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dataDeliveryNoticeDismissed', 'true');
    }
  };

  const navigateTo = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Service notice */}
        {displayNotice && (
          <div className="mb-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      Service Information
                    </h3>
                    <button
                      onClick={hideNotice}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                    Data bundles are delivered within 5 minutes to 4 hours depending on network conditions.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-900 dark:text-white">Delivery Time</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-amber-600">5 min - 4 hours</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-900 dark:text-white">Business Hours</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-blue-600">8:00 AM - 9:00 PM</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">7 days a week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {getTimeGreeting()}, {userName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Welcome back to your dashboard
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={goToTopup}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-none justify-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Top Up</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('/orders')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-none justify-center"
                >
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Balance */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Account Balance</p>
                <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                  {startAnimation ? 
                    <CurrencyCounter value={stats.balance} duration={1500} /> : 
                    formatMoney(0)
                  }
                </div>
              </div>
              <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            
            <button
              onClick={goToTopup}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4" />
              Add Funds
            </button>
          </div>
        </div>

        {/* Network selection */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Select Network
              </h2>
              
              <button
                onClick={handleRefreshInventory}
                disabled={networkInventory.mtn.loading || networkInventory.airteltigo.loading || networkInventory.telecel.loading}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                title="Refresh inventory status"
              >
                <svg className={`w-4 h-4 ${(networkInventory.mtn.loading || networkInventory.airteltigo.loading || networkInventory.telecel.loading) ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* MTN Card */}
              <button 
                onClick={() => goToNetwork('mtn')}
                disabled={!networkInventory.mtn.inStock}
                className={`relative p-4 sm:p-6 rounded-lg transition-all active:scale-95 shadow-lg ${
                  networkInventory.mtn.inStock 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 cursor-pointer' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="absolute top-2 right-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                    networkInventory.mtn.loading 
                      ? 'bg-gray-200 text-gray-600' 
                      : networkInventory.mtn.inStock 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      networkInventory.mtn.loading 
                        ? 'bg-gray-400' 
                        : networkInventory.mtn.inStock 
                          ? 'bg-white animate-pulse' 
                          : 'bg-white'
                    }`}></div>
                    <span className="text-[10px]">
                      {networkInventory.mtn.loading ? 'Checking' : networkInventory.mtn.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 sm:mx-auto sm:mb-3 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 p-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="#FFCC00"/>
                      <text x="50" y="58" fontSize="36" fontWeight="bold" fill="#000000" textAnchor="middle" fontFamily="Arial, sans-serif">
                        MTN
                      </text>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#000000" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="flex-1 sm:flex-none text-left sm:text-center">
                    <p className="text-sm sm:text-base font-bold text-white">MTN Ghana</p>
                    <p className="text-xs text-yellow-100 mt-0.5 sm:mt-1">
                      {networkInventory.mtn.inStock ? 'Fast & Reliable' : 'Currently Unavailable'}
                    </p>
                  </div>
                </div>
              </button>

              {/* AirtelTigo Card */}
              <button 
                onClick={() => goToNetwork('airteltigo')}
                disabled={!networkInventory.airteltigo.inStock}
                className={`relative p-4 sm:p-6 rounded-lg transition-all active:scale-95 shadow-lg ${
                  networkInventory.airteltigo.inStock 
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="absolute top-2 right-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                    networkInventory.airteltigo.loading 
                      ? 'bg-gray-200 text-gray-600' 
                      : networkInventory.airteltigo.inStock 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      networkInventory.airteltigo.loading 
                        ? 'bg-gray-400' 
                        : networkInventory.airteltigo.inStock 
                          ? 'bg-white animate-pulse' 
                          : 'bg-white'
                    }`}></div>
                    <span className="text-[10px]">
                      {networkInventory.airteltigo.loading ? 'Checking' : networkInventory.airteltigo.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 sm:mx-auto sm:mb-3 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 p-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="atGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#ED1C24', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#C1272D', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="45" fill="url(#atGradient)"/>
                      <path d="M 35 40 L 50 25 L 65 40 L 50 35 Z" fill="white"/>
                      <text x="50" y="70" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
                        AirtelTigo
                      </text>
                    </svg>
                  </div>
                  <div className="flex-1 sm:flex-none text-left sm:text-center">
                    <p className="text-sm sm:text-base font-bold text-white">AirtelTigo</p>
                    <p className="text-xs text-red-100 mt-0.5 sm:mt-1">
                      {networkInventory.airteltigo.inStock ? 'Premium Quality' : 'Currently Unavailable'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Telecel Card */}
              <button 
                onClick={() => goToNetwork('telecel')}
                disabled={!networkInventory.telecel.inStock}
                className={`relative p-4 sm:p-6 rounded-lg transition-all active:scale-95 shadow-lg ${
                  networkInventory.telecel.inStock 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="absolute top-2 right-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                    networkInventory.telecel.loading 
                      ? 'bg-gray-200 text-gray-600' 
                      : networkInventory.telecel.inStock 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      networkInventory.telecel.loading 
                        ? 'bg-gray-400' 
                        : networkInventory.telecel.inStock 
                          ? 'bg-white animate-pulse' 
                          : 'bg-white'
                    }`}></div>
                    <span className="text-[10px]">
                      {networkInventory.telecel.loading ? 'Checking' : networkInventory.telecel.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 sm:mx-auto sm:mb-3 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 p-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="telecelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#0066CC', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#004B9B', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <rect x="10" y="10" width="80" height="80" rx="12" fill="url(#telecelGradient)"/>
                      <circle cx="35" cy="35" r="8" fill="white"/>
                      <circle cx="65" cy="35" r="8" fill="white"/>
                      <path d="M 30 55 Q 50 70 70 55" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                      <text x="50" y="90" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
                        Telecel
                      </text>
                    </svg>
                  </div>
                  <div className="flex-1 sm:flex-none text-left sm:text-center">
                    <p className="text-sm sm:text-base font-bold text-white">Telecel Ghana</p>
                    <p className="text-xs text-blue-100 mt-0.5 sm:mt-1">
                      {networkInventory.telecel.inStock ? 'Growing Network' : 'Currently Unavailable'}
                    </p>
                  </div>
                </div>
              </button>
            </div>
            
            {(networkInventory.mtn.lastChecked || networkInventory.airteltigo.lastChecked || networkInventory.telecel.lastChecked) && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-right">
                Last checked: {(networkInventory.mtn.lastChecked || networkInventory.airteltigo.lastChecked || networkInventory.telecel.lastChecked)?.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Orders and Revenue Stats */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                  {startAnimation ? 
                    <AnimatedCounter value={stats.todayOrders} duration={1200} /> : 
                    "0"
                  }
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Orders Today</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total transactions</p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {startAnimation ? 
                    <CurrencyCounter value={stats.todayRevenue} duration={1500} /> : 
                    formatMoney(0)
                  }
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Revenue Today</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total earnings</p>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                <button 
                  onClick={viewAllOrders}
                  className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {stats.recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.customer}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{tx.gb}GB • {tx.method}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatMoney(tx.amount)}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                    <Database className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: Package, label: 'New Order', path: '/datamart' },
            { icon: BarChart2, label: 'Analytics', path: '/reports' },
            { icon: Clock, label: 'History', path: '/orders' },
            { icon: CreditCard, label: 'Top Up', onClick: goToTopup },
            { icon: AlertCircle, label: 'Support', path: '/support' },
            { icon: User, label: 'Profile', path: '/profile' }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick || (() => navigateTo(action.path))}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <action.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-900 dark:text-white text-center">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;