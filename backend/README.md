# EsportsIndia Backend API

MongoDB-based backend server for authentication and user management.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong random string for JWT signing
     - `EMAIL_USER`: Your email address (Gmail recommended)
     - `EMAIL_PASS`: Your email app password (not regular password)
     - `PORT`: Server port (default: 5000)
     - `FRONTEND_URL`: Your frontend URL for CORS

3. **MongoDB Setup**
   - **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/esportsindia`
   - **MongoDB Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and use the connection string

4. **Email Setup (Gmail)**
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password: Google Account → Security → App Passwords
   - Use the app password in `EMAIL_PASS`

5. **Start the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/forgot-password` - Request password reset
  ```json
  {
    "email": "john@example.com"
  }
  ```

- `POST /api/auth/reset-password` - Reset password with token
  ```json
  {
    "token": "reset_token_from_email",
    "password": "newpassword123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires authentication header)

### OTP

- `POST /api/otp/send` - Send OTP to email
  ```json
  {
    "email": "john@example.com",
    "purpose": "email_verification" // or "password_reset" or "login"
  }
  ```

- `POST /api/otp/verify` - Verify OTP
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```

## Authentication

Protected routes require an Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Environment Variables

See `.env.example` for all required variables.
