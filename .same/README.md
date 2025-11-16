# Physical Planning Management System

A comprehensive web application for managing physical planning operations within a Land Department, built with Next.js, Supabase, and TypeScript.

## Features

### Core Modules

1. **Dashboard**
   - Real-time statistics and analytics
   - Application trends visualization
   - Status distribution charts
   - Recent applications overview

2. **Development Applications**
   - Submit and track development applications
   - Multiple application types (building permits, subdivisions, rezoning, etc.)
   - Workflow management with status tracking
   - Priority levels and assignment system

3. **Land Parcels**
   - Comprehensive parcel registry
   - Zoning district associations
   - Owner information management
   - Area calculations and mapping

4. **Zoning Districts**
   - Zoning classification management
   - Regulations and restrictions
   - Visual color coding
   - District-specific rules

5. **Development Plans**
   - Strategic and area-specific plans
   - Plan lifecycle management
   - Document attachments

6. **Site Inspections**
   - Schedule and track inspections
   - Multiple inspection types
   - Photo documentation
   - Compliance status tracking

7. **Compliance Monitoring**
   - Violation tracking
   - Enforcement actions
   - Severity classification
   - Resolution management

8. **User Management** (Admin)
   - Create and manage users
   - Role-based access control (Admin, Planner, Officer, Viewer)
   - Department assignments
   - User status management

## Database Schema

The system uses Supabase with the following main tables:

- `users` - User profiles and roles
- `development_applications` - Application records
- `land_parcels` - Land parcel registry
- `zoning_districts` - Zoning classifications
- `application_documents` - Document attachments
- `application_reviews` - Review workflow tracking
- `site_inspections` - Inspection records
- `development_plans` - Strategic plans
- `compliance_records` - Violation tracking
- `activity_logs` - System audit trail

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Setup Instructions

### 1. Database Setup

Execute the SQL schema in Supabase SQL Editor:
- Navigate to `.same/database-schema.sql`
- Copy the entire SQL content
- Run it in your Supabase project's SQL Editor

### 2. Environment Variables

Already configured in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://yvnkyjnwvylrweyzvibs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Run Development Server

```bash
bun dev
```

The application will be available at `http://localhost:3000`

## User Roles & Permissions

- **Admin**: Full system access, user management, all CRUD operations
- **Planner**: Application review, plan management, inspections
- **Officer**: Application submission, document management, view access
- **Viewer**: Read-only access to applications and reports

## Application Workflow

1. **Submission**: Applicant submits development application
2. **Initial Screening**: Officer reviews for completeness
3. **Technical Review**: Planner evaluates against regulations
4. **Site Inspection**: On-site verification if required
5. **Public Consultation**: Community feedback (if applicable)
6. **Final Decision**: Approval or rejection with notes

## Key Features to Implement

- [ ] Document upload functionality
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Map integration for parcels
- [ ] Report generation (PDF)
- [ ] Activity timeline for applications
- [ ] Public portal for application submission
- [ ] Payment integration for fees
- [ ] Mobile responsiveness enhancements
- [ ] Real-time collaboration features

## API Routes (To Be Added)

- `/api/applications` - CRUD operations
- `/api/parcels` - Parcel management
- `/api/users` - User management
- `/api/documents` - File upload/download
- `/api/reports` - Generate reports

## Security Considerations

- Row Level Security (RLS) enabled on all tables
- Authentication required for all dashboard routes
- Role-based access control for sensitive operations
- Secure file upload with validation
- Activity logging for audit trails

## Integration Points

This subsystem is designed to integrate with:
- Main Land Management System
- GIS/Mapping systems
- Payment gateways
- Document management systems
- Notification services
- Reporting engines

## Support

For issues or questions, contact the development team or refer to the Supabase documentation.
