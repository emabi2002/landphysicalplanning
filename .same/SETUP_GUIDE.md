# Physical Planning System - Setup Guide

## Important: Shared Authentication Setup

This Physical Planning subsystem **shares authentication** with the main Land Management System. Users already exist in Supabase Auth and only need profile entries in this subsystem's tables.

## Step 1: Database Setup in Supabase

1. **Login to Supabase**: Go to https://supabase.com and login to your project
   - Your project URL: `https://yvnkyjnwvylrweyzvibs.supabase.co`

2. **Execute Database Schema**:
   - Navigate to the SQL Editor in Supabase dashboard
   - Open the file `.same/database-schema.sql` in this project
   - Copy the entire SQL content
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the schema

   This will create all necessary tables:
   - users
   - development_applications
   - land_parcels
   - zoning_districts
   - application_documents
   - application_reviews
   - site_inspections
   - development_plans
   - compliance_records
   - activity_logs

3. **Verify Tables**:
   - Go to the "Table Editor" in Supabase
   - You should see all 10 tables listed

## Step 2: Add User Profile for Existing Admin

Since authentication is shared, the user **admin@lands.gov.pg** already exists in `auth.users`. You only need to create the profile entry:

### Find the User ID

1. Go to Supabase Dashboard > Authentication > Users
2. Find the user with email `admin@lands.gov.pg`
3. Copy their User ID (UUID format like: `12345678-1234-1234-1234-123456789abc`)

### Create User Profile

Run this in SQL Editor (replace the UUID with the actual user ID from above):

```sql
-- Add admin user profile to Physical Planning system
INSERT INTO public.users (id, email, full_name, role, department, status)
VALUES (
  'PASTE_USER_ID_HERE',  -- Replace with actual UUID from auth.users
  'admin@lands.gov.pg',
  'System Administrator',
  'admin',
  'Physical Planning Division',
  'active'
)
ON CONFLICT (id) DO UPDATE
SET
  role = 'admin',
  department = 'Physical Planning Division',
  status = 'active';
```

### Quick Method (Automatic)

Or use this query to automatically sync the user:

```sql
-- Automatically add admin user profile
INSERT INTO public.users (id, email, full_name, role, department, status)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'System Administrator'),
  'admin',
  'Physical Planning Division',
  'active'
FROM auth.users
WHERE email = 'admin@lands.gov.pg'
ON CONFLICT (id) DO UPDATE
SET
  role = 'admin',
  department = 'Physical Planning Division',
  status = 'active';
```

## Step 3: Add Additional Users (Optional)

For other existing users who need access to Physical Planning:

```sql
-- Add existing user to Physical Planning system
INSERT INTO public.users (id, email, full_name, role, department, status)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email),
  'planner',  -- Change role as needed: admin, planner, officer, viewer
  'Physical Planning Division',
  'active'
FROM auth.users
WHERE email = 'user@lands.gov.pg'  -- Replace with actual email
ON CONFLICT (id) DO UPDATE
SET
  role = EXCLUDED.role,
  department = EXCLUDED.department;
```

## Step 4: Access the Application

1. The application is running at: http://localhost:3000
2. You'll be redirected to the login page
3. Login with your existing credentials:
   - Email: **admin@lands.gov.pg**
   - Password: (your existing password)

## Step 5: Add Sample Data (Optional)

To test the system, you can add some sample data:

```sql
-- Add sample zoning districts
INSERT INTO public.zoning_districts (name, code, description, color) VALUES
('Residential Zone 1', 'R1', 'Low density residential', '#10b981'),
('Commercial Zone', 'C1', 'Commercial business district', '#3b82f6'),
('Industrial Zone', 'I1', 'Light industrial', '#f59e0b'),
('Mixed Use Zone', 'MU1', 'Mixed residential and commercial', '#8b5cf6');

-- Add sample land parcels
INSERT INTO public.land_parcels (parcel_number, address, area_sqm, zoning_district_id, owner_name, status)
SELECT
  'P-2024-001',
  '123 Main Street, Port Moresby',
  500.00,
  id,
  'John Doe',
  'registered'
FROM public.zoning_districts WHERE code = 'R1';

INSERT INTO public.land_parcels (parcel_number, address, area_sqm, zoning_district_id, owner_name, status)
SELECT
  'P-2024-002',
  '456 Commerce Ave, Port Moresby',
  1200.00,
  id,
  'ABC Corporation',
  'registered'
FROM public.zoning_districts WHERE code = 'C1';

-- Add a sample application
INSERT INTO public.development_applications (
  application_number,
  applicant_name,
  applicant_email,
  applicant_phone,
  application_type,
  project_title,
  project_description,
  proposed_use,
  estimated_cost,
  status,
  priority
) VALUES (
  'APP-2024-001',
  'Jane Smith',
  'jane@example.com',
  '+675 123 4567',
  'building_permit',
  'Two Story Residential Building',
  'Construction of a modern 2-story residential building with 4 bedrooms',
  'Residential',
  250000.00,
  'submitted',
  'normal'
);
```

## Authentication Flow

### How Shared Authentication Works:

1. **User logs in** → Supabase Auth validates credentials
2. **Token is issued** → Contains user ID from `auth.users`
3. **App checks** → Looks for matching profile in `public.users` table
4. **Access granted** → Based on role in `public.users`

### User Roles:

- **Admin**: Full system access, user management, all operations
- **Planner**: Application review, plan management, inspections
- **Officer**: Application submission, document management, view access
- **Viewer**: Read-only access to applications and reports

## Adding New Users from Other Subsystems

When a user from another subsystem needs access:

```sql
-- Template for adding existing auth user to Physical Planning
INSERT INTO public.users (id, email, full_name, role, department, status)
VALUES (
  'user-uuid-from-auth-users',
  'user@lands.gov.pg',
  'User Full Name',
  'planner',  -- Choose appropriate role
  'Physical Planning Division',
  'active'
);
```

## Troubleshooting

### Can't Login
- ✅ Verify user exists in `auth.users` (check Authentication tab)
- ✅ Verify user profile exists in `public.users` with correct UUID
- ✅ Check that status is 'active' in `public.users`
- ✅ Verify email matches exactly in both tables

### No Data Showing
- ✅ Check that RLS policies are properly set up
- ✅ Verify you're logged in as a user with proper role
- ✅ Check browser console for errors

### User Has No Access/Wrong Role
```sql
-- Update user role
UPDATE public.users
SET role = 'admin', status = 'active'
WHERE email = 'admin@lands.gov.pg';
```

## Integration Notes

### Future Separation
When you need to separate authentication later:
1. The database schema supports independent operation
2. Row Level Security (RLS) is already configured
3. Just migrate users from shared auth to separate Supabase project
4. Update environment variables to point to new Supabase project

### Current Integration Benefits
- ✅ Single sign-on across all subsystems
- ✅ Centralized user management
- ✅ Consistent authentication flow
- ✅ Easy to add users from other departments

## Next Steps

After setup, you can:
1. Customize the dashboard charts with real data
2. Add document upload functionality
3. Implement detailed application review workflow
4. Add map integration for parcels
5. Create custom reports
6. Set up email notifications

## Support

For issues:
1. Check the `.same/README.md` for detailed documentation
2. Review Supabase logs in the dashboard
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
