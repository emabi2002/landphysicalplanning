# Physical Planning Management System

A comprehensive subsystem for managing physical planning operations within the Papua New Guinea Land Department.

## 🎉 NEW: GIS & Legal Integration

**Version 10** now includes:
- ✅ **Interactive GIS Mapping** with React-Leaflet
- ✅ **Legal Case Management** integration
- ✅ **Real-time Spatial Data** visualization
- ✅ **SLA-based Request Tracking** with auto-alerts
- ✅ **Bi-directional Legal-Planning Communication**

📖 **[Complete GIS & Legal Guide](.same/GIS_LEGAL_INTEGRATION_GUIDE.md)**

## 🚀 Quick Start

### ⚡ Development Mode (Current)

**Authentication is currently bypassed** for rapid development!

```bash
bun dev
# Opens directly to dashboard - no login needed!
# Perfect for building features fast
```

📖 **[Development Mode Guide](.same/DEVELOPMENT_MODE.md)** - How to re-enable auth later

---

### 🔐 Production Setup (When Ready)

### 1. Database Setup

Execute the database schema in your Supabase project:

```bash
# File: .same/database-schema.sql
# Copy and run in Supabase SQL Editor
```

### 2. Add User Profile (Shared Authentication)

Since you're using **shared authentication** with `admin@lands.gov.pg`, run:

```sql
-- Quick setup (includes sample data)
-- File: .same/quick-setup.sql
-- Copy and run in Supabase SQL Editor
```

Or manually add just the user profile:

```sql
INSERT INTO public.users (id, email, full_name, role, department, status)
SELECT
  id, email,
  COALESCE(raw_user_meta_data->>'full_name', 'System Administrator'),
  'admin', 'Physical Planning Division', 'active'
FROM auth.users
WHERE email = 'admin@lands.gov.pg'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', department = 'Physical Planning Division';
```

### 3. Start Development Server

```bash
bun dev
```

Access at: **http://localhost:3000**

Login with: **admin@lands.gov.pg** (your existing password)

## 📚 Documentation

- **[Setup Guide](.same/SETUP_GUIDE.md)** - Detailed setup instructions
- **[Technical Docs](.same/README.md)** - Complete technical documentation
- **[Database Schema](.same/database-schema.sql)** - Full database schema
- **[Quick Setup](.same/quick-setup.sql)** - Fast setup with sample data

## ✨ Features

### Core Modules
- 📊 **Dashboard** - Real-time analytics and statistics
- 🗺️ **GIS Mapping** - Interactive spatial planning with Leaflet ✨ NEW
- ⚖️ **Legal Integration** - Bi-directional case management ✨ NEW
- 📝 **Development Applications** - Submit and track applications
- 🗺️ **Land Parcels** - Parcel registry and GeoJSON mapping
- 🏘️ **Zoning Districts** - Zoning classifications with spatial data
- 🏗️ **Development Plans** - Strategic planning
- 🔍 **Site Inspections** - Inspection scheduling and tracking
- ⚖️ **Compliance Monitoring** - Violation tracking
- 👥 **User Management** - Role-based access control

### GIS Capabilities ✨ NEW
- **Interactive Map** - Powered by React-Leaflet and OpenStreetMap
- **Spatial Layers** - Parcels, zoning, roads, utilities
- **Real-time Updates** - Live data from Supabase
- **Click-to-View** - Parcel details on map interaction
- **Color-Coded Zoning** - Visual district representation
- **GeoJSON Support** - Full spatial data integration

### Legal Case Integration ✨ NEW
- **Bi-Directional Requests** - From/to Legal Division
- **SLA Tracking** - Auto-calculated deadlines and overdue alerts
- **11 Request Types** - All planning-legal interactions covered
- **Workflow Automation** - Auto-assignment, notifications, audit trail
- **Document Management** - Attachments in both directions
- **Spatial Evidence** - GPS coordinates, photos, site data
- **Officer Workload** - Performance tracking and allocation

### Application Types Supported
- Building Permits
- Subdivisions
- Change of Use
- Rezoning
- Site Plan Approvals
- Variances
- Special Permits

### User Roles
- **Admin** - Full system access
- **Planner** - Application review and planning
- **Officer** - Application submission and processing
- **Viewer** - Read-only access

## 🔐 Shared Authentication

This subsystem shares authentication with the main Land Management System:

- ✅ Single sign-on across all subsystems
- ✅ Centralized user management
- ✅ Users only need profile entries in this subsystem
- ✅ Easy to separate later when needed

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Shared)
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Language**: TypeScript

## 📦 Project Structure

```
physical-planning-system/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── dashboard/    # Main application pages
│   │   └── login/        # Authentication
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── dashboard/   # Dashboard widgets
│   │   ├── layout/      # Layout components
│   │   └── users/       # User management
│   └── lib/             # Utilities and helpers
├── .same/               # Documentation and setup
│   ├── README.md        # Technical documentation
│   ├── SETUP_GUIDE.md   # Setup instructions
│   ├── database-schema.sql
│   └── quick-setup.sql
└── .env.local          # Environment variables
```

## 🔧 Environment Variables

Already configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yvnkyjnwvylrweyzvibs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 🎯 Workflow Example

1. **Applicant** submits a development application
2. **Officer** reviews for completeness
3. **Planner** conducts technical review
4. **Inspector** performs site inspection
5. **Planner** makes final decision
6. System tracks entire process with status updates

## 📈 Future Enhancements

- [ ] Document upload and management
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] GIS map integration
- [ ] PDF report generation
- [ ] Mobile app integration
- [ ] Payment processing
- [ ] Public application portal
- [ ] Real-time collaboration

## 🔗 Integration

Ready to integrate with:
- Main Land Management System
- GIS/Mapping systems
- Document management systems
- Payment gateways
- Email notification services

## 📞 Support

For issues or questions:
1. Check the documentation in `.same/`
2. Review Supabase dashboard logs
3. Check browser console for errors

## 📝 License

Internal use - Papua New Guinea Land Department

---

**Built with Next.js + Supabase**
