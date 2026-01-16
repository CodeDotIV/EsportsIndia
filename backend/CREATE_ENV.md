# Create .env File

## Quick Instructions

Your `.env` file needs to be created manually. Here's the exact content:

### Option 1: Copy from template
```bash
cd backend
cp .env.template .env
```

### Option 2: Manual creation
1. Open `backend/.env` in your editor (create it if it doesn't exist)
2. Copy and paste this exact content:

```
MONGODB_URI=mongodb+srv://noreplyesportsindia_db_user:2JFBXAP4HC1sYbDr@cluster0.tppbbdo.mongodb.net/esportsindia?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=32d8306993df3645c9de14d11c1d00ae88370a3f3948455309b1667c715170db
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=noreply.esportsindia@gmail.com
EMAIL_PASS=caxyfwbwmuwfgfih
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
```

3. Save the file

### Option 3: Use the setup script
```bash
cd backend
npm run setup-env
```

Then manually edit `.env` to add your email credentials if needed.

## After Creating .env

Once the `.env` file is created with the correct content, restart your server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-02.tppbbdo.mongodb.net
✅ Email service ready
🚀 Server running on port 5000
```

## All Credentials Configured

✅ MongoDB URI: Configured  
✅ JWT Secret: Generated  
✅ Email User: noreply.esportsindia@gmail.com  
✅ Email Password: Configured  
✅ Port: 5000  
✅ Frontend URL: http://localhost:8081  

Everything is ready! Just create the `.env` file and start the server.
