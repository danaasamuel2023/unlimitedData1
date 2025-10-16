'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  RefreshCw, 
  ArrowRight,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle,
  Zap,
  Star,
  Flame
} from 'lucide-react';

// Toast Notification Component
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
          ? 'bg-yellow-500/95 text-black border-yellow-400/50' 
          : type === 'error' 
            ? 'bg-red-500/95 text-white border-red-400/50' 
            : 'bg-yellow-500/95 text-black border-yellow-400/50'
      }`}>
        <div className="mr-2">
          {type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : type === 'error' ? (
            <X className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
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

// Registration Closed Modal Component
const RegistrationClosedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 w-full max-w-md shadow-xl">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Registration Closed
          </h3>
          <button onClick={onClose} className="text-white hover:text-white/70 p-1 rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="px-6 py-4">
          <div className="flex items-start mb-4">
            <div className="w-6 h-6 rounded-lg bg-red-500/30 flex items-center justify-center mr-3 flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-300" />
            </div>
            <div>
              <p className="text-white font-medium text-sm mb-2">
                We're sorry, but new registrations are currently closed.
              </p>
              <p className="text-white/70 text-sm">
                Please check back later or contact our support team for more information.
              </p>
            </div>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-white/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl transition-all transform hover:scale-105 text-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Registration closed state
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async () => {
    setError('');
    
    // Check if registration is closed
    if (isRegistrationClosed) {
      setShowModal(true);
      return;
    }
    
    setIsSubmitting(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      showToast("Passwords do not match", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://unlimiteddatagh.onrender.com/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          referredBy: formData.referralCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Registration successful! Redirecting to login...", "success");
        // Use a direct, synchronous approach for navigation
        setTimeout(() => {
          try {
            // Force a hard navigation instead of client-side navigation
            window.location.href = '/SignIn';
          } catch (err) {
            console.error("Navigation error:", err);
            showToast("Registration successful. Please go to the login page to continue.", "success");
          }
        }, 2000);
      } else {
        setError(data.message || 'Signup failed');
        showToast(data.message || 'Signup failed', 'error');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
      showToast('An error occurred. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements - More visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-300/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/10 to-yellow-500/10 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* Registration Closed Modal */}
      <RegistrationClosedModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-black p-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Star className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Flame className="w-3 h-3 text-white animate-bounce" />
            </div>
            
            <div className="relative z-10 text-center">
              {/* UnlimitedData Gh Logo */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
                  <div className="text-center">
                    <Zap className="w-6 h-6 text-yellow-300 mx-auto mb-1" strokeWidth={3} />
                    <div className="text-white font-bold text-xs">DATA</div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-1">UNLIMITEDDATA GH</h1>
              <p className="text-white/90 text-sm font-medium">Create Your Account</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            {/* Registration Closed Warning */}
            {isRegistrationClosed && (
              <div className="mb-4 p-3 rounded-xl flex items-start bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-sm">
                <div className="w-5 h-5 rounded-lg bg-yellow-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-yellow-300" />
                </div>
                <div>
                  <span className="text-yellow-200 font-medium text-sm">Registration is currently closed. Form is disabled.</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 rounded-xl flex items-start bg-red-500/20 border border-red-500/40 backdrop-blur-sm">
                <div className="w-5 h-5 rounded-lg bg-red-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-red-300" />
                </div>
                <span className="text-red-200 font-medium text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-yellow-400" />
                </div>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium text-sm"
                  required 
                  disabled={isSubmitting || isRegistrationClosed}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium text-sm"
                  required 
                  disabled={isSubmitting || isRegistrationClosed}
                />
              </div>

              {/* Phone Number Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-yellow-400" />
                </div>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  placeholder="Phone Number" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium text-sm"
                  required 
                  disabled={isSubmitting || isRegistrationClosed}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-yellow-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium text-sm"
                  required 
                  disabled={isSubmitting || isRegistrationClosed}
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-yellow-400" />
                </div>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium text-sm"
                  required 
                  disabled={isSubmitting || isRegistrationClosed}
                />
              </div>

              {/* Referral Code Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RefreshCw className="w-4 h-4 text-yellow-400" />
                </div>
                <input 
                  type="text" 
                  name="referralCode"
                  placeholder="Referral Code (Optional)" 
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 block w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium text-sm"
                  disabled={isSubmitting || isRegistrationClosed}
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSignup}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-xl font-bold transition-all duration-300 transform ${
                  (isSubmitting || isRegistrationClosed)
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white opacity-60 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50'
                }`}
                disabled={isSubmitting || isRegistrationClosed}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Creating Account...
                  </>
                ) : isRegistrationClosed ? (
                  <>
                    <AlertTriangle className="mr-2 w-4 h-4" />
                    Registration Closed
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 w-4 h-4" />
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-white font-medium text-sm">
                Already have an account? 
                <a href="/SignIn" className="text-yellow-400 hover:text-yellow-300 ml-1 font-bold hover:underline transition-colors">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}