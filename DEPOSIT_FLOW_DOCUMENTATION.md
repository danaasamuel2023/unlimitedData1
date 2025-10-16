# 💳 Paystack Deposit Flow Documentation

## 🔄 Complete Deposit Process

### 1. **User Initiates Deposit**
- User visits `/deposite` or `/topup` page
- Enters amount (minimum GHS 10, maximum GHS 50,000)
- Provides email address
- Clicks "Pay with Paystack"

### 2. **Frontend Processing**
```javascript
// Frontend sends request to backend
const response = await fetch('/api/v1/deposit', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: userData.id,
    amount: parseFloat(amount),
    email: email
  })
});
```

### 3. **Backend Validation & Processing**
- ✅ Validates MongoDB ObjectId format for userId
- ✅ Checks if user exists in database
- ✅ Validates account status (not disabled, approved)
- ✅ Validates amount (GHS 10 - GHS 50,000)
- ✅ Validates email format
- ✅ Calculates 3% processing fee
- ✅ Creates transaction record in database

### 4. **Paystack Integration**
```javascript
// Backend initializes Paystack payment
const paystackResponse = await axios.post(
  'https://api.paystack.co/transaction/initialize',
  {
    email: user.email,
    amount: totalAmountWithFee * 100, // Convert to pesewas
    currency: 'GHS',
    reference: uniqueReference,
    callback_url: 'https://unlimiteddatagh.com/payment/callback?reference=' + reference
  }
);
```

### 5. **User Payment**
- User redirected to Paystack's secure payment page
- User completes payment (card/mobile money)
- Paystack processes the payment

### 6. **Payment Verification (Automatic)**
```javascript
// Paystack sends webhook to backend
POST /api/v1/paystack/webhook
{
  "event": "charge.success",
  "data": {
    "reference": "DEP-abc123-1234567890",
    "amount": 5150, // Amount in pesewas
    "status": "success"
  }
}
```

### 7. **Balance Crediting Process**
```javascript
// Backend verifies payment with Paystack
const paystackData = await axios.get(
  `https://api.paystack.co/transaction/verify/${reference}`
);

// Update user balance
user.walletBalance += depositAmount;
await user.save();

// Update transaction status
transaction.status = 'completed';
transaction.balanceAfter = user.walletBalance;
await transaction.save();
```

### 8. **User Notification**
- SMS sent to user with new balance
- User redirected to callback page
- Success message displayed

## 🛡️ Security Features

### **Fraud Detection**
- Amount validation (1% tolerance for rounding)
- Suspicious activity monitoring
- IP-based rate limiting
- Transaction metadata tracking

### **Error Handling**
- Comprehensive input validation
- Clear error codes and messages
- Transaction rollback on failures
- Detailed logging for debugging

## 📊 API Endpoints

### **Main Endpoints**
- `POST /api/v1/deposit` - Initialize Paystack payment
- `POST /api/v1/paystack/webhook` - Paystack webhook handler
- `GET /api/v1/verify-payment` - Manual payment verification
- `GET /api/v1/callback` - Payment callback page

### **Testing Endpoint**
- `POST /api/v1/test-deposit` - Validate deposit parameters without processing

## 🎯 Error Codes

| Code | Description |
|------|-------------|
| `MISSING_USER_ID` | User ID not provided |
| `INVALID_USER_ID_FORMAT` | Invalid MongoDB ObjectId format |
| `USER_NOT_FOUND` | User doesn't exist in database |
| `INVALID_AMOUNT` | Invalid amount value |
| `AMOUNT_TOO_LOW` | Amount below GHS 10 |
| `AMOUNT_TOO_HIGH` | Amount above GHS 50,000 |
| `INVALID_EMAIL` | Invalid email format |
| `ACCOUNT_DISABLED` | User account is disabled |
| `ACCOUNT_PENDING` | Account pending approval |
| `ACCOUNT_REJECTED` | Account has been rejected |
| `PAYSTACK_INIT_FAILED` | Paystack API initialization failed |

## 🔧 Configuration

### **Environment Variables Required**
```env
PAYSTACK_SECRET_KEY=sk_live_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
MNOTIFY_API_KEY=your_sms_api_key
BASE_URL=https://unlimiteddatagh.com
```

### **Fee Structure**
- Processing Fee: 3% of deposit amount
- Minimum Deposit: GHS 10
- Maximum Deposit: GHS 50,000

## 🚀 Deployment Status

- ✅ **Frontend:** Modern UI with Paystack integration
- ✅ **Backend:** Enhanced validation and error handling
- ✅ **Database:** Transaction tracking and user balance management
- ✅ **Paystack:** Payment processing and webhook verification
- ✅ **SMS:** Automatic notifications for successful deposits

## 🎯 Ready for Production

The deposit system is fully implemented and ready for production use. Users can:
1. Make secure deposits via Paystack
2. Get automatic balance crediting
3. Receive SMS confirmations
4. View transaction history
5. Get clear error messages for any issues

The system handles all edge cases and provides comprehensive security and fraud protection.
