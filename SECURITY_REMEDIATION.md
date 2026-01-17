# 🔒 Security Remediation Guide

## ⚠️ CRITICAL: Secret Leak Detected

GitGuardian has detected exposed secrets in your repository. **Immediate action is required.**

## ✅ What Has Been Fixed

1. **Removed all hardcoded secrets** from source files:
   - `backend/server.js` - Removed MongoDB URI from error message
   - `backend/setup-env.js` - **DELETED** (contained secrets)
   - `backend/setup-env.sh` - **DELETED** (contained secrets)
   - `backend/CREATE_ENV.md` - **DELETED** (contained secrets)
   - `backend/ENV_SETUP.md` - Updated with placeholders

2. **Created `.env.example`** template with placeholders only

3. **Verified `.gitignore`** - `.env` files are properly ignored

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. Rotate All Exposed Secrets

#### MongoDB Atlas Password
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to: **Database Access** → Select user `noreplyesportsindia_db_user`
3. Click **Edit** → **Edit Password**
4. Generate a new strong password
5. Update your `.env` file with the new password
6. Update the connection string in your `.env` file

#### JWT Secret
1. Generate a new JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update `JWT_SECRET` in your `.env` file
3. **Important**: All existing user sessions will be invalidated

#### Gmail App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Generate a new app password for "Mail"
3. Update `EMAIL_PASS` in your `.env` file
4. Revoke the old app password

### 2. Remove Secrets from Git History

The secrets are still in your git history. You need to remove them:

#### Option A: Using git-filter-repo (Recommended)
```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove secrets from history
git filter-repo --path backend/server.js --invert-paths
git filter-repo --path backend/setup-env.js --invert-paths
git filter-repo --path backend/setup-env.sh --invert-paths
git filter-repo --path backend/CREATE_ENV.md --invert-paths
git filter-repo --path backend/ENV_SETUP.md --invert-paths

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

#### Option B: Using BFG Repo-Cleaner
```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
# Create a file with secrets to remove
echo "2JFBXAP4HC1sYbDr" > secrets.txt
echo "32d8306993df3645c9de14d11c1d00ae88370a3f3948455309b1667c715170db" >> secrets.txt
echo "caxyfwbwmuwfgfih" >> secrets.txt

# Run BFG
java -jar bfg.jar --replace-text secrets.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

#### Option C: Create New Repository (Safest)
If the leak is critical, consider:
1. Creating a new repository
2. Copying only the cleaned code (without secrets)
3. Updating all remote URLs

### 3. Verify Current State

Check that no secrets remain in tracked files:
```bash
# Search for any remaining secrets
grep -r "2JFBXAP4HC1" .
grep -r "32d8306993df3645c9de14d11c1d00ae88370a3f3948455309b1667c715170db" .
grep -r "caxyfwbwmuwfgfih" .
```

### 4. Set Up Environment Variables

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Fill in your **NEW** credentials (after rotation):
   ```env
   MONGODB_URI=mongodb+srv://username:NEW_PASSWORD@cluster.mongodb.net/database
   JWT_SECRET=NEW_GENERATED_SECRET
   EMAIL_PASS=NEW_GMAIL_APP_PASSWORD
   ```

3. **Never commit `.env` file**

## 📋 Checklist

- [ ] Rotated MongoDB password
- [ ] Generated new JWT secret
- [ ] Generated new Gmail app password
- [ ] Updated `.env` file with new credentials
- [ ] Removed secrets from git history (or created new repo)
- [ ] Verified no secrets remain in codebase
- [ ] Tested application with new credentials
- [ ] Notified team members (if applicable)

## 🔐 Prevention

1. **Always use `.env` files** for secrets
2. **Never commit** `.env` files (verify `.gitignore`)
3. **Use `.env.example`** with placeholders for documentation
4. **Review code** before committing for hardcoded secrets
5. **Use secret scanning tools** like GitGuardian or GitHub Secret Scanning
6. **Rotate secrets regularly** (every 90 days recommended)

## 📞 Support

If you need help with secret rotation or git history cleanup, refer to:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Git Filter Repo Guide](https://github.com/newren/git-filter-repo)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
