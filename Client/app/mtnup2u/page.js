'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, Star, AlertTriangle, CheckCircle, X, Info, Shield, Phone, CreditCard, ArrowRight, Sparkles, Filter, SortAsc, SortDesc, Wifi, Battery, Clock } from 'lucide-react';

// Toast Notification Component - Compact
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`p-3 rounded-xl shadow-xl flex items-center backdrop-blur-xl border max-w-sm ${
        type === 'success' 
          ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
          : type === 'error' 
            ? 'bg-red-500/90 text-white border-red-400/50' 
            : 'bg-yellow-500/90 text-white border-yellow-400/50'
      }`}>
        <div className="mr-2">
          {type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : type === 'error' ? (
            <X className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
        </div>
        <div className="flex-grow">
          <p className="font-medium text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="ml-3 hover:scale-110 transition-transform">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Purchase Modal Component
const PurchaseModal = ({ isOpen, onClose, bundle, phoneNumber, setPhoneNumber, onPurchase, error, isLoading }) => {
  if (!isOpen || !bundle) return null;

  const handlePhoneNumberChange = (e) => {
    let formatted = e.target.value.replace(/\D/g, '');
    
    if (!formatted.startsWith('0') && formatted.length > 0) {
      formatted = '0' + formatted;
    }
    
    if (formatted.length > 10) {
      formatted = formatted.substring(0, 10);
    }
    
    setPhoneNumber(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPurchase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 w-full max-w-md shadow-xl">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Purchase {bundle.capacity}GB
          </h3>
          <button onClick={onClose} className="text-white hover:text-white/70 p-1 rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="px-6 py-4">
          {/* Bundle Info */}
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Data Bundle:</span>
              <span className="text-yellow-300 font-bold">{bundle.capacity}GB</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Duration:</span>
              <span className="text-yellow-300 font-bold">No-Expiry</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/20 pt-2">
              <span className="text-white font-bold">Total Price:</span>
              <span className="text-yellow-300 font-bold text-lg">GH₵{bundle.price}</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-start bg-red-500/20 border border-red-500/30">
              <X className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          {/* Phone Number Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white">
                Enter MTN Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-yellow-400" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium"
                  placeholder="0XXXXXXXXX"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-1 text-xs text-white/70">Format: 0 followed by 9 digits</p>
            </div>

            {/* Warning */}
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-200 text-xs">
                    <strong>Important:</strong> Verify your number carefully. No refunds for wrong numbers.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !phoneNumber || phoneNumber.length !== 10}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Purchase Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ServiceInfoModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 w-full max-w-md shadow-xl">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Service Notice
          </h3>
          <button onClick={onClose} className="text-white hover:text-white/70 p-1 rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3 text-white/80 text-sm">
            <div className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-emerald-400 mr-2 mt-2 flex-shrink-0"></div>
              <p><strong className="text-white">Not instant service</strong> - delivery times vary</p>
            </div>
            <div className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-emerald-400 mr-2 mt-2 flex-shrink-0"></div>
              <p>For urgent data, use <strong className="text-white">*138#</strong> instead</p>
            </div>
            <div className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-emerald-400 mr-2 mt-2 flex-shrink-0"></div>
              <p>Please be patient - orders may take time to process</p>
            </div>
            <div className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-emerald-400 mr-2 mt-2 flex-shrink-0"></div>
              <p>Not suitable for instant bundle needs</p>
            </div>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-xl mt-4">
            <div className="flex items-start">
              <Info className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-200 text-sm">
                Thank you for your patience and understanding.
              </p>
            </div>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-white/10 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Overlay - Compact
const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-xs w-full mx-auto text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-3 border-yellow-200/20"></div>
            <div className="absolute top-0 w-12 h-12 rounded-full border-3 border-transparent border-t-yellow-400 border-r-amber-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 animate-pulse flex items-center justify-center">
              <Zap className="w-4 h-4 text-white animate-bounce" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <h4 className="text-lg font-bold text-white mb-2">Processing...</h4>
        <p className="text-white/80 text-sm">Please wait while we process your order</p>
      </div>
    </div>
  );
};

const MTNBundleSelect = () => {
  const [selectedBundle, setSelectedBundle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState(null);
  const [sortBy, setSortBy] = useState('size'); // 'size', 'price', 'value'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  
  // Manual inventory control
  const inventoryAvailable = true;
  
  // Updated bundles with correct backend prices and enhanced data
  const bundles = [
    { value: '1', label: '1GB', capacity: '1', price: '4.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.50, popular: false },
    { value: '2', label: '2GB', capacity: '2', price: '9.20', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.60, popular: false },
    { value: '3', label: '3GB', capacity: '3', price: '13.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.50, popular: true },
    { value: '4', label: '4GB', capacity: '4', price: '18.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.63, popular: false },
    { value: '5', label: '5GB', capacity: '5', price: '23.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.70, popular: false },
    { value: '6', label: '6GB', capacity: '6', price: '27.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.50, popular: true },
    { value: '8', label: '8GB', capacity: '8', price: '35.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.44, popular: false },
    { value: '10', label: '10GB', capacity: '10', price: '43.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.35, popular: true },
    { value: '15', label: '15GB', capacity: '15', price: '62.50', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.17, popular: false },
    { value: '20', label: '20GB', capacity: '20', price: '83.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.15, popular: false },
    { value: '25', label: '25GB', capacity: '25', price: '105.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.20, popular: false },
    { value: '30', label: '30GB', capacity: '30', price: '129.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.30, popular: true },
    { value: '40', label: '40GB', capacity: '40', price: '166.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.15, popular: false },
    { value: '50', label: '50GB', capacity: '50', price: '207.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.14, popular: false },
    { value: '100', label: '100GB', capacity: '100', price: '407.00', network: 'YELLO', inStock: inventoryAvailable, valuePerGB: 4.07, popular: true }
  ];

  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .animate-slide-in {
        animation: slideIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Function to validate phone number format
  const validatePhoneNumber = (number) => {
    const cleanNumber = number.replace(/[\s-]/g, '');
    
    if (cleanNumber.startsWith('0')) {
      return cleanNumber.length === 10 && /^0\d{9}$/.test(cleanNumber);
    }
    
    return false;
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (input) => {
    let formatted = input.replace(/\D/g, '');
    
    if (!formatted.startsWith('0') && formatted.length > 0) {
      formatted = '0' + formatted;
    }
    
    if (formatted.length > 10) {
      formatted = formatted.substring(0, 10);
    }
    
    return formatted;
  };

  const handlePhoneNumberChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  // Function to show toast
  const showToast = (message, type = 'success') => {
    setToast({
      visible: true,
      message,
      type
    });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      visible: false
    }));
  };

  // Get selected bundle details
  const getSelectedBundleDetails = () => {
    return bundles.find(bundle => bundle.value === selectedBundle);
  };

  // Sort bundles based on selected criteria
  const getSortedBundles = () => {
    const sorted = [...bundles].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'size':
          comparison = parseInt(a.capacity) - parseInt(b.capacity);
          break;
        case 'price':
          comparison = parseFloat(a.price) - parseFloat(b.price);
          break;
        case 'value':
          comparison = a.valuePerGB - b.valuePerGB;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Handle bundle selection - opens purchase modal
  const handleBundleSelect = (bundle) => {
    if (!bundle.inStock) {
      showToast('This bundle is currently out of stock', 'error');
      return;
    }

    if (!userData || !userData.id) {
      showToast('Please login to continue', 'error');
      return;
    }

    setSelectedBundle(bundle.value);
    setPendingPurchase(bundle);
    setPhoneNumber(''); // Reset phone number
    setError(''); // Clear any previous errors
    setIsPurchaseModalOpen(true);
  };

  // Process the actual purchase
  const processPurchase = async () => {
    if (!pendingPurchase) return;
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid MTN number (10 digits starting with 0)');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('https://unlimiteddatagh.onrender.com/api/v1/data/purchase-data', {
        userId: userData.id,
        phoneNumber: phoneNumber,
        network: pendingPurchase.network,
        capacity: parseInt(pendingPurchase.capacity), // Make sure it's an integer
        price: parseFloat(pendingPurchase.price)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        showToast(`${pendingPurchase.capacity}GB purchased successfully for ${phoneNumber}!`, 'success');
        setSelectedBundle('');
        setPhoneNumber('');
        setError('');
        setIsPurchaseModalOpen(false);
        setPendingPurchase(null);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      const errorMessage = error.response?.data?.message || 'Purchase failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Elements - Yellow Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400/10 to-amber-400/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-400/10 to-yellow-400/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/5 to-amber-300/5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />
      
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <ServiceInfoModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              setIsModalOpen(false);
            }}
          />

          <PurchaseModal
            isOpen={isPurchaseModalOpen}
            onClose={() => {
              setIsPurchaseModalOpen(false);
              setPendingPurchase(null);
              setPhoneNumber('');
              setError('');
            }}
            bundle={pendingPurchase}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onPurchase={processPurchase}
            error={error}
            isLoading={isLoading}
          />
          
          {/* Header - Modern Yellow Theme */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl border-4 border-white">
                <span className="text-2xl font-bold text-white">M</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 text-transparent bg-clip-text">
                  MTN UP2U
                </h1>
                <p className="text-amber-600 font-medium">Unlimited Data Bundles</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-amber-700">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>No Expiry</span>
              </div>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4" />
                <span>High Speed</span>
              </div>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Battery className="w-4 h-4" />
                <span>Reliable</span>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-yellow-200/50 shadow-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Service Info Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-700 font-medium rounded-xl hover:bg-yellow-500/30 transition-all"
              >
                <Info className="h-5 w-5" />
                <span>Service Information</span>
              </button>

              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-700 font-medium">Sort by:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-yellow-300 rounded-lg text-amber-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="size">Data Size</option>
                  <option value="price">Price</option>
                  <option value="value">Best Value</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="p-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-700 rounded-lg hover:bg-yellow-500/30 transition-all"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bundle Grid - Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {getSortedBundles().map((bundle) => (
              <div
                key={bundle.value}
                className={`group relative bg-white/90 backdrop-blur-xl rounded-2xl border-2 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  bundle.inStock
                    ? 'border-yellow-200 hover:border-yellow-400 cursor-pointer'
                    : 'border-gray-300 cursor-not-allowed opacity-60'
                } ${bundle.popular ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
              >
                {/* Popular Badge */}
                {bundle.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-amber-300/20"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold text-white mb-1">{bundle.label}</div>
                    <div className="text-yellow-100 text-sm">No Expiry Data</div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-amber-600 mb-1">GH₵{bundle.price}</div>
                    <div className="text-sm text-amber-500">GH₵{bundle.valuePerGB.toFixed(2)}/GB</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>High Speed Internet</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>No Expiry Date</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Instant Activation</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleBundleSelect(bundle)}
                    disabled={!bundle.inStock}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all transform ${
                      bundle.inStock
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {bundle.inStock ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Buy Now</span>
                      </div>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice - Enhanced */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-red-600 mb-3">Important Service Notice</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-red-700">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Not instant service - delivery takes time</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Turbonet & Broadband SIMs not eligible</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No refunds for wrong numbers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>For urgent data, use *138# instead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MTNBundleSelect;