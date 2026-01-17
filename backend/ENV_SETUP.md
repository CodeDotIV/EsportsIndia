# Environment Variables Setup

## MongoDB Connection String

Your MongoDB Atlas connection string has been configured. Use this in your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

## Complete .env File Template

Create a `.env` file in the `backend` directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret (Generate a strong random key)
JWT_SECRET=generate_a_strong_random_secret_key_here

# JWT Expiration
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8081
```

## Next Steps

1. **Create `.env` file**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Update `.env` with your MongoDB URI** (get it from MongoDB Atlas dashboard)

3. **Set up Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Generate an app password for "Mail"
   - Replace `your_gmail_app_password` in `.env`

4. **Update EMAIL_USER** with your Gmail address

5. **Start the server**:
   ```bash
   npm run dev
   ```

## Important Notes

- ⚠️ **Never commit `.env` file to git** (it's already in `.gitignore`)
- 🔒 Keep your MongoDB credentials secure
- 📧 Use Gmail App Password, not your regular password
- 🌐 Update `FRONTEND_URL` if your frontend runs on a different port
