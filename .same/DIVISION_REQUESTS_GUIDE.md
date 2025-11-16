# Inter-Division Requisition System Guide

## 📋 Overview

The **Division Requests** module is a bi-directional requisition system that allows ANY division in the department to send and receive requests from Physical Planning Division and vice versa.

## 🔄 How It Works

### **Incoming Requests** (TO Physical Planning)
Requests FROM other divisions that Physical Planning needs to respond to:
- Legal Division → Physical Planning
- Finance Division → Physical Planning
- HR Division → Physical Planning
- Procurement → Physical Planning
- IT Division → Physical Planning
- etc.

### **Outgoing Requests** (FROM Physical Planning)
Requests FROM Physical Planning TO other divisions:
- Physical Planning → Legal Division
- Physical Planning → Finance Division
- Physical Planning → Surveyor General
- Physical Planning → Any Division
- etc.

## 🎯 Request Types

### General Types (All Divisions)
- **Information Request** - General information needed
- **Document Request** - Specific documents needed
- **Technical Opinion** - Expert opinion required
- **Site Inspection Request** - Field inspection needed
- **Approval Request** - Approval/clearance needed
- **Verification Request** - Verification of information

### Planning-Specific Types
- Zoning Confirmation
- Development Approval Verification
- Compliance Investigation
- Parcel History Request
- Spatial Evidence Request
- Boundary Dispute Assessment
- Planning Opinion

### Division-Specific Types
- **Financial Clearance** (Finance)
- **Budget Allocation** (Finance)
- **Procurement Request** (Procurement)
- **HR Request** (Human Resources)
- **IT Support Request** (IT)

## 📊 System Features

### 1. **Event Calendar**
- All requests appear as events on the division calendar
- View by due date
- Color-coded by status and urgency
- Click date to see all requests due that day

### 2. **Time Stamping**
- `submitted_date` - When request was created
- `received_at` - When request was acknowledged
- `assigned_at` - When assigned to officer
- `due_date` - Deadline for response
- `completed_at` - When request was completed
- Auto-calculated `days_remaining`

### 3. **SLA Monitoring**
- Each request has an SLA period (default 10 days)
- Auto-calculates due dates
- Overdue indicator when past deadline
- Days remaining countdown

### 4. **Notification Badge**
- Sidebar shows count of **unattended incoming** requests
- Auto-refreshes every 30 seconds
- Only counts requests with status "submitted" or "received"

### 5. **Workflow Tracking**
- Status progression: submitted → received → assigned → in_progress → completed
- Activity timeline logs all changes
- Assignment to planning officers
- Response submission with findings/recommendations

## 📥 Database Schema

### Key Fields

```sql
request_number          -- Auto-generated (REQ-2025-001)
requesting_division     -- Who is asking
receiving_division      -- Who needs to respond
direction              -- 'incoming' or 'outgoing'
contact_person_name    -- Person to contact
contact_person_email   -- Contact email
division_reference     -- Their internal reference number
request_type          -- Type of request
subject               -- Brief description
description           -- Detailed information
urgency               -- low, normal, high, urgent
status                -- workflow status
submitted_date        -- When created
due_date              -- Deadline
sla_days              -- Response period
```

## 🚀 Setup Instructions

### 1. Upgrade Existing Data
Run this in Supabase SQL Editor:
```sql
-- Run: .same/upgrade-to-division-requests.sql
```

This will:
- Add division tracking fields
- Update existing data
- Expand request types
- Create view for better querying

### 2. Add Sample Data (Optional)
Run this to see diverse examples:
```sql
-- Run: .same/insert-division-sample-data.sql
```

This adds 8 sample requests showing:
- 5 incoming (from Legal, Finance, HR, Procurement, IT)
- 3 outgoing (to Legal, Surveyor General, Finance)

### 3. Use the System

#### For Incoming Requests:
1. Other divisions create requests (using API or form)
2. Requests appear in "Incoming" tab with badge notification
3. Physical Planning staff:
   - Reviews request
   - Assigns to appropriate officer
   - Officer investigates/prepares response
   - Submits response with findings
   - Request marked as completed

#### For Outgoing Requests:
1. Physical Planning creates request using "New Request" button
2. Selects receiving division
3. Fills in details
4. Submits to other division
5. Tracks response in system

## 📱 User Interface

### Main Views

1. **Table View**
   - Filter: Incoming / Outgoing / All
   - Shows: From/To division, subject, status, SLA, urgency
   - Unattended requests highlighted in blue
   - Mail icons (closed = unread, open = read)

2. **Calendar View**
   - Visual tracking by due date
   - Color indicators (green = active, red = overdue)
   - Click date to see requests
   - Navigate months

3. **Request Detail Page**
   - Full request information
   - Tabs: Workflow, Response, Documents, Activity
   - Assign officer dialog
   - Withdraw request option
   - SLA tracking sidebar

### Stats Dashboard

- **Unattended** - New incoming requests needing attention
- **Pending Action** - All active requests
- **Overdue** - Past deadline
- **Completed** - Resolved requests

## 🔐 Permissions

Current setup (Development Mode):
- All users can view all requests
- All users can create/update requests

Production setup (recommended):
- Division staff can only see relevant requests
- Only assigned officers can update
- Supervisors can reassign
- Administrators have full access

## 🎨 Customization

### Add New Division
Just use the division name in `requesting_division` or `receiving_division` fields.

### Add New Request Type
Update the constraint in the database:
```sql
ALTER TABLE legal_planning_requests
ADD CONSTRAINT check_request_type
CHECK (request_type IN (..., 'your_new_type'));
```

### Change SLA Periods
Default is 10 days. Can be customized per request type or division.

## 📊 Reporting

Track:
- Requests by division
- Average response time
- Overdue requests
- Officer workload
- Request types distribution

## 🔄 Integration

### External API
Other divisions can:
- Submit requests via API endpoint: `POST /api/legal-requests`
- Check status: `GET /api/legal-requests/{id}`
- Receive webhooks on status changes (future)

### Email Notifications (Future)
- New request notification
- Assignment notification
- Response received
- Approaching deadline
- Overdue alert

## 📌 Best Practices

1. **Clear Subjects** - Write descriptive subject lines
2. **Complete Information** - Provide all details needed
3. **Realistic SLA** - Set achievable deadlines
4. **Prompt Assignment** - Assign within 1-2 days
5. **Regular Updates** - Update status as work progresses
6. **Document Attachments** - Include supporting files
7. **Activity Comments** - Log important notes

## 🎯 Success Metrics

- Requests handled: Target 95% within SLA
- Average response time: Target < SLA period
- Unattended requests: Target < 2 days
- Overdue requests: Target < 5%
- User satisfaction: Regular feedback

---

**You've successfully transformed the Legal Requests into a comprehensive Inter-Division Requisition System!** 🎉
