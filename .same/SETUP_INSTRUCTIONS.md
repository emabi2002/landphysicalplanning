# Setup Instructions - Legal Request System

## 🚀 Quick Setup (5 minutes)

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Run the Setup Script

1. Open the file `.same/setup-legal-requests.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

You should see a success message and sample data statistics.

### Step 3: Verify Installation

The script will create:
- ✅ `legal_planning_requests` table with all required columns
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ 6 sample legal requests for testing

### Step 4: Test the System

1. Refresh your application at `/dashboard/legal-requests`
2. You should now see:
   - **Sidebar badge** showing "2" (unattended requests)
   - **Stats cards** with real numbers
   - **Table view** with 6 sample requests
   - **Calendar view** with requests marked on their due dates

### Step 5: Understanding the Sample Data

The sample requests include:
- **2 Unattended** (status: submitted/received) → Will show in sidebar badge
- **1 Assigned** → Being worked on
- **1 In Progress** → Active work
- **1 Completed** → Finished
- **1 Overdue** → Past deadline (will show red indicators)

## 🎯 What You Can Do Now

### Create New Request
- Click "New Request" button
- Fill in the form
- Watch it appear in both Table and Calendar views
- See sidebar badge update

### View in Calendar
- Click "Calendar View" tab
- See requests marked on their due dates
- Click any date to see requests due that day
- Navigate between months

### Track Unattended Requests
- Unattended requests (status: submitted/received) show:
  - 🔵 Blue highlight in table
  - ✉️ Closed mail icon
  - 🏷️ "NEW" badge
  - 📊 Count in sidebar badge

### Monitor SLA
- Each request has a due date
- Overdue requests show red indicators
- Days remaining calculated automatically

## 🔧 Next Features to Implement

1. **Assignment Workflow**
   - Assign requests to planning officers
   - Track workload distribution

2. **Notifications**
   - Email alerts for new requests
   - SMS for urgent requests
   - Push notifications

3. **Integration**
   - API connection with Legal Department
   - Automated request creation
   - Status synchronization

## 📝 Notes

- The sidebar badge auto-refreshes every 30 seconds
- Sample data uses realistic Papua New Guinea government context
- All timestamps are in your database timezone
- You can modify or delete sample data anytime

## ❓ Troubleshooting

**If you see errors:**
1. Make sure you're logged into Supabase
2. Check that the SQL script ran completely
3. Verify the table was created in "Table Editor"
4. Check browser console for specific errors

**If sidebar badge doesn't update:**
1. Wait 30 seconds for auto-refresh
2. Manually refresh the page
3. Check that the API endpoint `/api/legal-requests/unread-count` is working

## 🎉 You're Ready!

Your Legal Request Event Calendar system is now fully operational. Start testing by:
1. Viewing the calendar
2. Creating new requests
3. Watching the sidebar badge update
4. Exploring both Table and Calendar views
