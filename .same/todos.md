# Physical Planning System - TODOs

## Completed ✅
- [x] Legal Request notification badge in sidebar (shows unattended count = 3)
- [x] Unread/unattended status indicators (mail icons like email)
- [x] Calendar view for tracking legal requests and deadlines
- [x] Stats dashboard showing unattended, pending, overdue, and completed requests
- [x] Tab system for Table View and Calendar View
- [x] Visual highlights for unattended requests in table (blue background, NEW badge)
- [x] Event calendar for division to track all legal requests
- [x] API endpoint for unread count
- [x] Database table creation (legal_planning_requests)
- [x] Sample data loaded (6 requests)
- [x] **FULL CRUD OPERATIONS**:
  - [x] CREATE: Complete form with document upload
  - [x] READ: List, detail, calendar, and stats views
  - [x] UPDATE: Assign officer, status workflow, response forms
  - [x] DELETE: Withdraw request with confirmation dialog

## Active Features 🎯
- ✅ Badge auto-refreshes every 30 seconds
- ✅ Unattended = submitted/received status (currently 3 requests)
- ✅ Calendar shows all requests by due date with indicators
- ✅ Assign Officer Dialog - fully functional
- ✅ Withdraw Request Dialog - soft delete to "closed" status
- ✅ Activity logging for all actions
- ✅ Document upload/download system

## To Do 📝
- [ ] Email/SMS notifications for new legal requests
- [ ] SLA monitoring and auto-escalation
- [ ] Integration with Legal Department system (external API)
- [ ] Bulk assignment of requests
- [ ] Advanced filtering and search
- [ ] Export reports to PDF

## Notes 📌
- The sidebar badge shows "3" unattended legal requests
- Badge refreshes every 30 seconds automatically
- All CRUD operations are fully functional and connected to Supabase
- Activity timeline logs all changes
- Soft delete preserves data (can be restored)
- File uploads go to Supabase Storage (bucket needs to be created)
