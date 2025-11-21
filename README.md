# HomelyHub - MERN Stack Airbnb Clone

A full-stack application built with MongoDB, Express.js, React, and Node.js that replicates the core functionality of Airbnb. Users can discover, book unique properties while hosts can list their accommodations and earn money.

## Features

### User Features
- 🔐 User authentication (Sign up, Login, Profile management)
- 🏘️ Browse and search properties with advanced filters
- 📅 Make bookings with date selection
- 💳 Secure payment integration with Stripe
- 📊 Manage bookings and view history
- 👤 Update profile and change password

### Host Features
- 🏠 List properties with images and detailed information
- 📈 Manage property listings
- 📋 View bookings for their properties
- 💰 Earn money from property bookings

### Admin Features
- 📊 Dashboard with analytics and statistics
- 👥 Manage users and roles
- 🏘️ Manage all properties on the platform
- 📅 Oversee all bookings
- 💹 View revenue statistics

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment Gateway**: Stripe
- **File Upload**: Multer

### Frontend
- **Framework**: React 18
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Payment**: Stripe React SDK
- **Styling**: CSS3

## Project Structure

```
WSA/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── properties.js
│   │   ├── bookings.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── PropertyDetails.js
│   │   │   ├── Profile.js
│   │   │   ├── Bookings.js
│   │   │   ├── PaymentPage.js
│   │   │   ├── HostProperties.js
│   │   │   ├── CreateProperty.js
│   │   │   └── AdminDashboard.js
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── propertySlice.js
│   │   │       └── bookingSlice.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Stripe Account

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/homelyhub
   JWT_SECRET=your_secure_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=5000
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with nodemon
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file:
   ```
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   npm start
   ```

   App will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users/bookings` - Get user bookings

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (Host only)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/host/:hostId` - Get host properties

### Bookings
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/property/:propertyId` - Get property bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create payment
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/status/:paymentIntentId` - Get payment status

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/properties` - Get all properties
- `GET /api/admin/bookings` - Get all bookings
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/properties/:id` - Delete property
- `DELETE /api/admin/bookings/:id` - Delete booking
- `GET /api/admin/stats/revenue` - Get revenue statistics

## User Roles

### Guest (User)
- Browse properties
- Make bookings
- Manage profile

### Host
- All guest features
- List properties
- Manage bookings for their properties

### Admin
- All user features
- Full platform management
- View analytics

## Usage

### As a Guest
1. Sign up / Login
2. Browse properties on home page
3. Use filters to search
4. Click on property for details
5. Select dates and book
6. Complete payment with Stripe

### As a Host
1. Sign up as Host
2. Navigate to "My Properties"
3. Create a new property
4. Upload images and details
5. View bookings for your properties

### As an Admin
1. Login as admin user
2. Visit admin panel
3. View dashboard statistics
4. Manage users, properties, and bookings

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- Protected API routes with role-based access
- Secure payment processing with Stripe
- Input validation
- CORS enabled

## Future Enhancements

- Email notifications for bookings
- Reviews and ratings system
- Wishlist functionality
- Advanced property search filters
- Property availability calendar
- Real-time chat with hosts
- Referral program
- Multi-language support
- Payment refund system

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify database name

### API Not Connecting
- Check backend is running on port 5000
- Verify CORS configuration
- Check proxy setting in frontend package.json

### Payment Issues
- Verify Stripe keys are correct
- Use Stripe test keys for development
- Check Stripe API version compatibility

## License

This project is part of WSA Academy coursework.

## Support

For issues or questions, please contact the development team or refer to the documentation.

---

**Happy Booking! 🎉**
