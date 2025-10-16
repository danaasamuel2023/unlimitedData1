# DataHustle Frontend

This is the frontend application for DataHustle - Ghana's Premier Data Marketplace.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env.local
```

3. Update the environment variables in `.env.local` with your actual values.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-api-url.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_APP_NAME=DataHustle
NEXT_PUBLIC_APP_URL=https://www.datahustle.shop
```

### Deployment

This application is configured for deployment on Render with the following features:

- Standalone output for optimal performance
- Security headers configured
- Image optimization enabled
- Compression enabled
- Production optimizations

### Project Structure

```
Client/
├── app/                    # Next.js 13+ app directory
├── component/              # Reusable components
├── compoenent/            # Additional components (legacy)
├── public/                # Static assets
├── utils/                 # Utility functions
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run build:analyze` - Build with bundle analyzer
- `npm run export` - Export static files

### Technologies Used

- Next.js 15
- React 19
- Tailwind CSS
- Framer Motion
- Axios
- Socket.io Client
- React Bootstrap
- React Hook Form
- React Hot Toast
- Recharts
- Lucide React

### Security Features

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Powered-by header removed
- Environment variable validation

### Performance Optimizations

- Image optimization with WebP and AVIF support
- Compression enabled
- Standalone output for faster cold starts
- React Strict Mode enabled
- Font optimization with Google Fonts