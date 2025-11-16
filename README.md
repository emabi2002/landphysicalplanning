# 🏛️ Physical Planning Division Management System

**A comprehensive web-based management system for Papua New Guinea's Lands & Physical Planning Department**

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://your-demo-url.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## 🎯 Overview

This full-featured web application digitizes and streamlines the operations of Papua New Guinea's Physical Planning Division, enabling efficient management of land development, planning applications, inspections, compliance monitoring, and inter-division communication.

## ✨ Key Features

### 🔄 **Inter-Division Requisition System**
- Bi-directional request tracking between all government divisions
- Real-time notification badges for unattended requests
- Email-style read/unread indicators
- Event calendar for division scheduling
- SLA monitoring with deadline tracking
- Support for 20+ request types (technical opinions, document requests, approvals, etc.)

### 🏗️ **Site Inspections Management**
- Schedule and track all types of inspections
- Record findings and compliance status
- Upload and geo-tag inspection photos
- Assign inspections to field officers
- Track inspection history and outcomes

### ⚖️ **Compliance Monitoring**
- Report and track violations (unauthorized development, zoning violations, etc.)
- Log enforcement actions and penalties
- Monitor case severity (minor → critical)
- Track resolution timelines
- Generate compliance reports

### 📋 **Development Plans Review**
- Submit and review subdivision plans
- Track master plans and development proposals
- Manage plan approval workflow
- Store and version plan documents
- Monitor validity periods

### 📝 **Development Applications**
- Complete application management system
- Track applications through approval process
- Link applications to parcels and plans
- Document upload and management

### 🗺️ **GIS Mapping System**
- Interactive map with drawing tools
- View and edit land parcels
- Zoning district visualization
- GPS coordinate capture
- Spatial evidence collection
- Support for GeoJSON, TopoJSON formats

### 🏘️ **Land Parcels Management**
- Comprehensive property records
- Parcel search and filtering
- Link to applications and legal cases
- Boundary and ownership tracking

### 🎨 **Zoning Districts**
- Manage zoning classifications
- Visual zoning map representation
- Zoning regulations and restrictions

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Maps:** React Leaflet, OpenStreetMap
- **Charts:** Recharts
- **Forms:** React Hook Form
- **Date Handling:** date-fns
- **Package Manager:** Bun

## 📊 System Modules

| Module | Status | Features |
|--------|--------|----------|
| Division Requests | ✅ Complete | CRUD, Calendar, Notifications |
| Site Inspections | ✅ Complete | Scheduling, Findings, Photos |
| Compliance | ✅ Complete | Violations, Enforcement, Actions |
| Development Plans | ✅ Complete | Review, Approval, Documents |
| Applications | ✅ Complete | Tracking, Workflow, Documents |
| Land Parcels | ✅ Complete | Records, Search, GIS Integration |
| Zoning Districts | ✅ Complete | Classification, Regulations |
| GIS Map | ✅ Complete | Interactive, Drawing, GPS |
| User Management | ✅ Complete | Roles, Permissions, Activity |
| Notifications | ✅ Complete | Real-time, Email, In-app |

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (or Supabase account)
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/emabi2002/landphysicalplanning.git
cd landphysicalplanning

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
# See .same/complete-database-schema.sql

# Start development server
bun dev
# or
npm run dev
```

Visit `http://localhost:3000`

## 📋 Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Run Database Scripts

In your Supabase SQL Editor, run these scripts in order:

```sql
-- 1. Main schema (users, applications, parcels, zoning)
.same/database-schema.sql

-- 2. GIS and Legal integration
.same/database-schema-gis-legal.sql

-- 3. Complete modules (inspections, compliance, plans)
.same/complete-database-schema.sql

-- 4. Sample data (optional for testing)
.same/insert-complete-sample-data.sql
```

### 3. Configure Environment

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📖 Documentation

Comprehensive documentation is available in the `.same/` directory:

- **[Setup Guide](.same/SETUP_GUIDE.md)** - Detailed installation instructions
- **[Activate All Modules](.same/ACTIVATE_ALL_MODULES.md)** - Enable all features
- **[Division Requests Guide](.same/DIVISION_REQUESTS_GUIDE.md)** - Requisition system
- **[GIS Integration](.same/GIS_LEGAL_INTEGRATION_GUIDE.md)** - Mapping features
- **[API Integration](.same/API_INTEGRATION_GUIDE.md)** - External system integration
- **[Quick Reference](.same/QUICK_REFERENCE.md)** - Common tasks

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Division Requests
![Division Requests](docs/screenshots/division-requests.png)

### GIS Map
![GIS Map](docs/screenshots/gis-map.png)

### Inspections
![Inspections](docs/screenshots/inspections.png)

## 🔐 Security Features

- Row Level Security (RLS) for data isolation
- Role-based access control (Admin, Officer, Viewer)
- Secure authentication with Supabase Auth
- Audit logging for all actions
- Development mode for testing (authentication bypass)

## 📱 Features in Detail

### Real-time Notifications
- Unattended request badges (auto-refresh every 30s)
- Email-style indicators (read/unread)
- Push notifications for urgent items

### Calendar Integration
- Visual timeline of all requests
- Color-coded by status and urgency
- Click dates to view details
- Monthly/weekly views

### Document Management
- Upload multiple file types
- Document versioning
- Secure storage via Supabase
- Download and preview

### Activity Logging
- Complete audit trail
- Track who did what and when
- Status change history
- Comment threads

## 🚀 Deployment

### Deploy to Netlify

```bash
# Build the project
bun run build

# Deploy
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

Ensure these are set in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Emmanuel Abi** - Initial work - [@emabi2002](https://github.com/emabi2002)

## 🙏 Acknowledgments

- Papua New Guinea Lands & Physical Planning Department
- Built with [Same](https://same.new) - AI-powered development platform
- Icons by [Lucide](https://lucide.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

For support and questions:
- 📧 Email: support@example.com
- 📖 Documentation: [docs](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/emabi2002/landphysicalplanning/issues)

## 🗺️ Roadmap

- [ ] Email notification system
- [ ] SMS alerts for urgent requests
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Integration with National Land Registry
- [ ] Public portal for application status
- [ ] Payment gateway integration
- [ ] Multi-language support (Tok Pisin, Hiri Motu)

---

**Built with ❤️ for Papua New Guinea's Physical Planning Division**

🤖 *Developed with [Same](https://same.new) - AI-powered web development*
