// Setup script to create .env file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `MONGODB_URI=mongodb+srv://noreplyesportsindia_db_user:2JFBXAP4HC1sYbDr@cluster0.tppbbdo.mongodb.net/esportsindia?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=32d8306993df3645c9de14d11c1d00ae88370a3f3948455309b1667c715170db
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=noreply.esportsindia@gmail.com
EMAIL_PASS=caxyfwbwmuwfgfih
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Don\'t forget to update EMAIL_USER and EMAIL_PASS with your Gmail credentials');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}
