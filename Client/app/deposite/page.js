'use client'
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ArrowRight,
  Phone,
  AlertCircle,
  RefreshCw,
  Info,
  Shield,
  Lock,
  Globe,
  Zap
} from 'lucide-react';

const API_BASE_URL = 'https://unlimiteddatagh.onrender.com/api/v1'; // Use deployed backend

const DataHustleDeposit = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'mobile'
  const [currentStep, setCurrentStep] = useState(1);
  const [paystackUrl, setPaystackUrl] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUserId(userData.id);
        setUserData(userData);
        setEmail(userData.email || '');
      } else {
        setErrorMsg('Please log in to make a deposit');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setErrorMsg('Unable to retrieve user information');
    }
  }, []);

  const validateForm = () => {
    if (!amount || parseFloat(amount) < 10) {
      setErrorMsg('Amount must be at least GHS 10');
      return false;
    }
    
    if (parseFloat(amount) > 50000) {
      setErrorMsg('Maximum deposit is GHS 50,000');
      return false;
    }
    
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return false;
    }
    
    if (!userId) {
      setErrorMsg('User ID not found. Please log in again');
      return false;
    }
    
    setErrorMsg('');
    return true;
  };

  const initializePaystackPayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/deposit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          email
        })
      });
      
      const data = await res.json();
      console.log('Paystack initialization response:', data);
      
      if (data.success) {
        setPaystackUrl(data.paystackUrl);
        setReference(data.reference);
        setSuccessMsg('Redirecting to secure payment page...');
        setCurrentStep(2);
        
        // Redirect to Paystack payment page
        window.location.href = data.paystackUrl;
      } else {
        setErrorMsg(data.error || 'Failed to initialize payment');
      }
    } catch (err) {
      console.error('Payment initialization error:', err);
      
      if (err.message?.includes('500') || err.message?.includes('Internal Server Error')) {
        setErrorMsg('Payment service is temporarily unavailable. Please try again in a few minutes or contact support at support@unlimiteddatagh.com');
      } else {
        setErrorMsg('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setEmail('');
    setCurrentStep(1);
    setPaystackUrl('');
    setReference('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
            Add Funds
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure payment with Paystack
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Secure Deposit</h2>
                    <p className="text-white/90 text-sm">Powered by Paystack</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-white/80" />
                  <span className="text-white/80 text-xs">SSL Secured</span>
                </div>
              </div>
              
              {/* Payment Method Toggle */}
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Card Payment
                </button>
                <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    paymentMethod === 'mobile'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  Mobile Money
                </button>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Success</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">{successMsg}</p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <form onSubmit={initializePaystackPayment} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Deposit Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-lg font-medium">₵</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-12 pr-4 py-4 block w-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all"
                      step="0.01"
                      min="10"
                      max="50000"
                      required
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Minimum: ₵10</span>
                    <span>Maximum: ₵50,000</span>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-12 pr-4 py-4 block w-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Payment receipt will be sent to this email
                  </p>
                </div>

                {/* Fee Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Fee Information</span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Deposit Amount:</span>
                      <span>₵{amount || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee (3%):</span>
                      <span>₵{(parseFloat(amount || 0) * 0.03).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                      <span>Total to Pay:</span>
                      <span>₵{(parseFloat(amount || 0) * 1.03).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !amount || !email}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-3" />
                      Pay with Paystack
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Redirecting to Payment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You will be redirected to Paystack's secure payment page to complete your deposit.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Secure Payment</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your payment is processed securely by Paystack. We never store your card details.
                  </p>
                </div>

                <button
                  onClick={resetForm}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  ← Back to Form
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact support at{' '}
            <a href="mailto:support@unlimiteddatagh.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              support@unlimiteddatagh.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataHustleDeposit;