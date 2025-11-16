# Password Reset Guide

This guide explains all methods to reset passwords in the Physical Planning System.

## 📧 Method 1: Self-Service Password Reset (Users)

### For Users Who Forgot Their Password:

1. **Go to Login Page**: http://localhost:3000/login
2. **Click "Forgot password?"** link below the Sign In button
3. **Enter your email address** (e.g., admin@lands.gov.pg)
4. **Click "Send Reset Link"**
5. **Check your email** for the password reset link
6. **Click the link** in the email
7. **Enter new password** (minimum 6 characters)
8. **Confirm password** by entering it again
9. **Click "Update Password"**
10. **Login** with your new password

### Important Notes:
- ✅ Reset link expires after 1 hour
- ✅ You must have access to the email account
- ✅ Email must be confirmed in Supabase
- ✅ Minimum password length is 6 characters

---

## 🔧 Method 2: Admin Reset via Supabase Dashboard

### For Admins to Reset Any User's Password:

1. **Go to Supabase Dashboard**: https://supabase.com
2. **Navigate to**: Authentication > Users
3. **Find the user** you want to reset
4. **Click the three dots** (⋮) next to the user
5. **Select "Reset Password"**
6. **Choose method**:
   - **Option A**: Send recovery email to user
   - **Option B**: Generate temporary password

---

## 💻 Method 3: SQL Query (Direct Database)

### For System Administrators:

Run this in Supabase SQL Editor:

```sql
-- Send password reset email to a user
SELECT auth.send_magic_link(
  'admin@lands.gov.pg',  -- Change to user's email
  'reset_password'
);
```

Or manually update the password (requires hashing):

```sql
-- Note: This method is NOT RECOMMENDED
-- Use Supabase Dashboard or email reset instead
-- This is for emergency access only

-- First, you need to hash the password using pgcrypto
-- Example: Set password to 'NewPassword123'
UPDATE auth.users
SET
  encrypted_password = crypt('NewPassword123', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'admin@lands.gov.pg';
```

⚠️ **Warning**: Direct database password updates may not trigger all necessary security hooks. Use with caution.

---

## 👤 Method 4: Admin Panel (Future Feature)

### Coming Soon:
Admins will be able to reset user passwords directly from the User Management page in the dashboard.

---

## 🔒 Password Requirements

- ✅ Minimum 6 characters
- ✅ No maximum length limit
- ✅ Can include letters, numbers, and special characters
- ✅ Case sensitive

---

## 🛠️ Troubleshooting

### "Email not sent" Error

**Cause**: Email service not configured in Supabase

**Solution**:
1. Go to Supabase Dashboard
2. Navigate to: Authentication > Email Templates
3. Configure SMTP settings or use Supabase default
4. Enable "Confirm Email" and "Reset Password" templates

### "Invalid or expired reset link"

**Causes**:
- Link was already used
- Link expired (after 1 hour)
- User already changed password

**Solution**:
- Request a new password reset link

### "Reset link not working"

**Solution**:
1. Check that redirect URL is correct in Supabase:
   - Go to Authentication > URL Configuration
   - Add `http://localhost:3000/reset-password` to redirect URLs
   - For production, add your domain

2. Verify in Supabase SQL Editor:
```sql
-- Check redirect URLs
SELECT * FROM auth.config;
```

### Email Not Received

**Checklist**:
- ✅ Check spam/junk folder
- ✅ Verify email address is correct
- ✅ Check email is confirmed in Supabase
- ✅ Wait a few minutes (sometimes delayed)
- ✅ Check Supabase email logs

---

## 📝 For Developers: Email Configuration

### Configure Email in Supabase

1. **Go to**: Project Settings > Authentication > Email
2. **Configure SMTP** (optional, for custom emails):
   ```
   Host: smtp.gmail.com (or your provider)
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```
3. **Or use Supabase Default** (limited to development)

### Customize Email Templates

1. **Go to**: Authentication > Email Templates
2. **Select**: "Reset Password"
3. **Customize** the email content:

```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password for Physical Planning System:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

---

## 🔐 Security Best Practices

### For Users:
- ✅ Use strong passwords (mix of letters, numbers, symbols)
- ✅ Don't share your password
- ✅ Change password regularly (every 90 days)
- ✅ Don't reuse passwords from other systems

### For Admins:
- ✅ Verify identity before resetting passwords
- ✅ Use audit logs to track password changes
- ✅ Enable two-factor authentication (future)
- ✅ Monitor failed login attempts

---

## 📊 Password Reset Audit Log

Track password resets in the database:

```sql
-- View recent password resets
SELECT
  id,
  email,
  raw_app_meta_data->>'provider' as provider,
  last_sign_in_at,
  updated_at
FROM auth.users
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

---

## 🚀 Quick Reference

| Method | Who Can Use | Time Required | Email Needed |
|--------|-------------|---------------|--------------|
| Self-Service | All users | 2-5 minutes | Yes |
| Admin Dashboard | Admins only | 1 minute | Optional |
| SQL Query | System admins | Instant | Optional |

---

## 📞 Support

If you encounter issues:

1. **Check this guide** first
2. **Verify Supabase configuration**
3. **Check email logs** in Supabase
4. **Review browser console** for errors
5. **Contact system administrator**

---

## 🔄 Related Documentation

- [Setup Guide](.same/SETUP_GUIDE.md) - Initial system setup
- [Technical Documentation](.same/README.md) - Complete system docs
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth) - Official Supabase documentation
