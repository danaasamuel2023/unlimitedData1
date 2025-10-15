# unlimitedData - Data Purchase Platform

A comprehensive data purchase platform with client and server components, built with Next.js and Node.js.

## 🚀 Features

- **User Authentication**: Sign up, sign in, and secure user management
- **Data Purchase**: Purchase mobile data bundles for various networks
- **Payment Integration**: Paystack payment gateway integration
- **SMS Notifications**: Automated SMS notifications via mNotify and Arkesel
- **Admin Dashboard**: Comprehensive admin panel for managing users and transactions
- **Order Management**: Track and manage data purchase orders
- **Referral System**: User referral and bonus system
- **Transaction History**: Complete transaction tracking and reporting

## 📁 Project Structure

```
unlimitedData/
├── Client/                 # Next.js Frontend Application
│   ├── app/               # Next.js 13+ App Router pages
│   ├── component/         # Reusable React components
│   ├── utils/             # Utility functions
│   └── public/            # Static assets
├── server/                # Node.js Backend API
│   ├── AuthRoutes/        # Authentication routes
│   ├── DepositeRoutes/    # Payment and deposit routes
│   ├── admin-management/  # Admin management functionality
│   ├── schema/            # Database schemas
│   └── middleware/        # Authentication middleware
└── env.example            # Environment variables template
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/danaasamuel2023/unlimitedData1.git
cd unlimitedData1
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Frontend Setup

```bash
cd ../Client
npm install
```

### 4. Environment Configuration

1. Copy the environment template:
```bash
cp env.example .env
```

2. Update the `.env` file with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/unlimiteddata

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key_here

# SMS Service Configuration
MNOTIFY_API_KEY=your_mnotify_api_key_here
ARKESEL_API_KEY=your_arkesel_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Database Setup

Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB Atlas cluster.

### 6. Run the Application

**Start the Backend Server:**
```bash
cd server
npm start
```

**Start the Frontend Development Server:**
```bash
cd Client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification

### Data Purchase
- `POST /api/orders/purchase` - Purchase data bundle
- `GET /api/orders/history` - Get order history
- `GET /api/orders/:id` - Get specific order

### Payments
- `POST /api/deposit/initialize` - Initialize payment
- `POST /api/deposit/verify` - Verify payment

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `POST /api/admin/approve` - Approve transactions

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Supported Networks

- MTN Ghana
- Vodafone Ghana
- AirtelTigo
- Telecel

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2

### Frontend Deployment

1. Build the application:
```bash
cd Client
npm run build
```

2. Deploy to platforms like:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/danaasamuel2023/unlimitedData1/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

- **v1.0.0** - Initial release with core functionality
- Authentication system
- Data purchase system
- Payment integration
- Admin dashboard
- SMS notifications

---

**Note**: Make sure to keep your API keys and sensitive information secure. Never commit actual API keys to the repository.
