# Security Notice

## ⚠️ IMPORTANT: Secret Leak Remediation

If you've found exposed secrets in this repository, please follow these steps:

### Immediate Actions Required

1. **Rotate All Exposed Secrets**:
   - **MongoDB**: Change the database user password in MongoDB Atlas
   - **JWT Secret**: Generate a new JWT secret key
   - **Email Password**: Generate a new Gmail App Password

2. **Remove Secrets from Git History**:
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner to remove secrets from history
   # Or consider creating a new repository if the leak is critical
   ```

3. **Verify .gitignore**:
   - Ensure `.env` files are in `.gitignore`
   - Never commit files containing actual secrets

### Current Status

✅ All hardcoded secrets have been removed from source files
✅ `.env` files are properly ignored
✅ `.env.example` template uses placeholders only

### Setting Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Fill in your actual credentials in `.env` (never commit this file)

3. Generate a new JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Reporting Security Issues

If you discover any security vulnerabilities, please report them responsibly.
