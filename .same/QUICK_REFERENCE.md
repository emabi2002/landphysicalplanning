# Quick Reference Guide

Quick answers to common tasks in the Physical Planning System.

## 🔐 Password Reset

### I forgot my password:
1. Go to login page
2. Click **"Forgot password?"**
3. Enter your email
4. Check email for reset link
5. Set new password

📖 **[Full Password Reset Guide](PASSWORD_RESET_GUIDE.md)**

---

## 👤 User Management

### Add a new user (Admin only):

```sql
-- In Supabase SQL Editor
INSERT INTO public.users (id, email, full_name, role, department, status)
SELECT
  id, email,
  'User Full Name',
  'planner',  -- Options: admin, planner, officer, viewer
  'Physical Planning Division',
  'active'
FROM auth.users
WHERE email = 'newuser@lands.gov.pg'
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role;
```

Or use the **Users** page in dashboard (Admin menu).

---

## 📝 Create an Application

1. Go to **Applications** in sidebar
2. Click **"New Application"**
3. Fill in required fields:
   - Applicant name (required)
   - Application type (required)
   - Project title (required)
4. Click **"Submit Application"**

---

## 🗺️ Add a Land Parcel

```sql
-- In Supabase SQL Editor
INSERT INTO public.land_parcels (
  parcel_number,
  address,
  area_sqm,
  owner_name,
  status
) VALUES (
  'P-2024-XXX',
  'Property Address',
  500.00,
  'Owner Name',
  'registered'
);
```

---

## 🏘️ Add a Zoning District

```sql
-- In Supabase SQL Editor
INSERT INTO public.zoning_districts (
  name,
  code,
  description,
  color
) VALUES (
  'Residential Zone 2',
  'R2',
  'Medium density residential',
  '#22c55e'
);
```

---

## 🔍 Search & Filter

### Find applications by status:
```sql
SELECT * FROM development_applications
WHERE status = 'under_review';
```

### Find parcels by owner:
```sql
SELECT * FROM land_parcels
WHERE owner_name ILIKE '%search term%';
```

---

## 📊 View Statistics

### Application counts by status:
```sql
SELECT
  status,
  COUNT(*) as count
FROM development_applications
GROUP BY status
ORDER BY count DESC;
```

### Applications this month:
```sql
SELECT COUNT(*)
FROM development_applications
WHERE submitted_date >= DATE_TRUNC('month', CURRENT_DATE);
```

---

## 🔧 Common Fixes

### User can't login:
1. Check user exists in `auth.users`
2. Check profile exists in `public.users`
3. Verify email matches in both tables
4. Check status is 'active'

```sql
-- Check user profile
SELECT * FROM public.users WHERE email = 'user@lands.gov.pg';

-- Fix inactive status
UPDATE public.users
SET status = 'active'
WHERE email = 'user@lands.gov.pg';
```

### Change user role:
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'user@lands.gov.pg';
```

### Application not showing:
- Check RLS policies
- Verify user has proper role
- Check application status

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `.same/database-schema.sql` | Database structure |
| `.same/quick-setup.sql` | Fast setup + sample data |
| `.same/SETUP_GUIDE.md` | Detailed setup |
| `.same/PASSWORD_RESET_GUIDE.md` | Password reset help |
| `.env.local` | Environment variables |

---

## 🚀 Deployment Checklist

- [ ] Execute database schema
- [ ] Add admin user profile
- [ ] Configure email in Supabase
- [ ] Test login/logout
- [ ] Test password reset
- [ ] Add sample data
- [ ] Test all modules
- [ ] Configure RLS policies
- [ ] Set up backups

---

## 📞 Emergency Contacts

- **System Admin**: [Contact info]
- **Database Admin**: [Contact info]
- **Supabase Support**: support@supabase.com
- **IT Help Desk**: [Contact info]

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com
- **Documentation**: `.same/README.md`
- **Setup Guide**: `.same/SETUP_GUIDE.md`
- **Password Reset**: `.same/PASSWORD_RESET_GUIDE.md`

---

Last Updated: 2024
