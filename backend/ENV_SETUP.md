# Environment Variables Setup

## MongoDB Connection String

Your MongoDB Atlas connection string has been configured. Use this in your `.env` file:

```env
MONGODB_URI=mongodb+srv://noreplyesportsindia_db_user:2JFBXAP4HC1sYbDr@cluster0.tppbbdo.mongodb.net/esportsindia?retryWrites=true&w=majority&appName=Cluster0
```

## Complete .env File Template

Create a `.env` file in the `backend` directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://noreplyesportsindia_db_user:2JFBXAP4HC1sYbDr@cluster0.tppbbdo.mongodb.net/esportsindia?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (Generated secure key)
JWT_SECRET=32d8306993df3645c9de14d11c1d00ae88370a3f3948455309b1667c715170db

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

2. **Update `.env` with your MongoDB URI** (already provided above)

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
