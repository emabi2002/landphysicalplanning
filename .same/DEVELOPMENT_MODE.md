# Development Mode Guide

## 🚀 Current Status: DEVELOPMENT MODE

Authentication is **currently bypassed** to allow rapid feature development without setting up the database and users.

### What's Different in Development Mode:

- ✅ No login required
- ✅ Direct access to dashboard on page load
- ✅ All features accessible without authentication
- ✅ No logout button (commented out)
- ✅ No role-based access control

### Benefits:

- 🏃 **Rapid Development**: Build features immediately
- 🧪 **Easy Testing**: Test all modules without user setup
- 🛠️ **Quick Iteration**: Focus on functionality first
- 📊 **Demo Ready**: Show features without authentication hassle

---

## 🔄 How to Re-Enable Authentication

When you're ready to implement proper authentication and role-based access control:

### Step 1: Update Middleware

File: `src/middleware.ts`

**Current (Development):**
```typescript
export async function middleware(request: NextRequest) {
  // DEVELOPMENT: Skip all authentication checks
  return NextResponse.next()

  /* PRODUCTION CODE HERE (commented out) */
}
```

**Change to (Production):**
```typescript
export async function middleware(request: NextRequest) {
  // Uncomment the entire section below:

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    // ... full authentication code
  )

  // ... rest of auth logic

  return supabaseResponse
}
```

### Step 2: Update Home Page

File: `src/app/page.tsx`

**Current (Development):**
```typescript
export default function HomePage() {
  redirect('/dashboard');  // Goes straight to dashboard
}
```

**Change to (Production):**
```typescript
export default function HomePage() {
  redirect('/login');  // Requires login first
}
```

### Step 3: Update Sidebar

File: `src/components/layout/sidebar.tsx`

**Uncomment the logout section:**
```typescript
<div className="border-t border-slate-800 p-4">
  <Button
    variant="ghost"
    className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
    onClick={handleLogout}
  >
    <LogOut className="mr-2 h-4 w-4" />
    Logout
  </Button>
</div>
```

And update `handleLogout`:
```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();  // Uncomment this
  router.push('/login');           // Change to '/login'
  router.refresh();
};
```

### Step 4: Setup Database

1. Execute `.same/database-schema.sql` in Supabase
2. Run `.same/quick-setup.sql` to add admin user
3. Configure email settings in Supabase (for password reset)

### Step 5: Test Authentication

1. Go to http://localhost:3000
2. Should redirect to `/login`
3. Login with admin@lands.gov.pg
4. Test all features with authentication
5. Test logout
6. Test password reset

---

## 📝 Files Modified for Development Mode

| File | What Changed | Line/Section |
|------|-------------|--------------|
| `src/middleware.ts` | Auth bypassed | Lines 12-14 |
| `src/app/page.tsx` | Redirects to dashboard | Line 5 |
| `src/components/layout/sidebar.tsx` | Logout button hidden | Bottom section |

---

## 🎯 Development Workflow

### Current Workflow (No Auth):
1. Start server: `bun dev`
2. Go to http://localhost:3000
3. Automatically in dashboard
4. Build and test features
5. No login/logout needed

### Future Workflow (With Auth):
1. Start server: `bun dev`
2. Go to http://localhost:3000
3. Redirected to login
4. Enter credentials
5. Access features based on role
6. Logout when done

---

## 🔐 Role-Based Access Control (Future)

When you re-enable authentication, you'll have:

### Admin Users:
- Full system access
- User management
- All CRUD operations
- System settings

### Planner Users:
- Application review
- Plan management
- Site inspections
- Reports

### Officer Users:
- Application submission
- Document management
- View applications
- Basic reports

### Viewer Users:
- Read-only access
- View applications
- View reports
- No modifications

---

## 🧪 Testing Without Database

Since auth is bypassed, you can test all features without setting up Supabase:

### What Works:
- ✅ All page navigation
- ✅ UI components
- ✅ Form layouts
- ✅ Dashboard charts (with sample data)
- ✅ Sidebar navigation

### What Doesn't Work (Requires Database):
- ❌ Creating applications (no DB to save to)
- ❌ User management (no users table)
- ❌ Real data in dashboard (uses sample data)
- ❌ Search and filters (no data to search)

### Workaround:
- Use sample/mock data in components
- Test UI/UX without backend
- Setup database when ready for integration testing

---

## 📋 Pre-Production Checklist

Before deploying to production:

- [ ] Execute database schema (`.same/database-schema.sql`)
- [ ] Add admin user (`.same/quick-setup.sql`)
- [ ] Re-enable authentication (uncomment middleware code)
- [ ] Update home page redirect (to `/login`)
- [ ] Enable logout button (uncomment in sidebar)
- [ ] Configure email settings in Supabase
- [ ] Test login/logout flow
- [ ] Test password reset
- [ ] Test all user roles
- [ ] Set up Row Level Security (RLS)
- [ ] Review and update RLS policies
- [ ] Test with real data
- [ ] Enable activity logging
- [ ] Set up backups

---

## 🚨 Important Notes

### Security Warning:
**Do NOT deploy to production with authentication disabled!**

This development mode is **only for local development**. Anyone can access the entire system without credentials.

### Data Warning:
Without the database setup, any data entered in forms will not be saved. Set up the database before testing data operations.

### Quick Toggle:
You can quickly switch between dev and production mode by commenting/uncommenting a few lines. All authentication code is preserved and ready to activate.

---

## 📞 Need Help?

- **Setup Database**: See `.same/SETUP_GUIDE.md`
- **Password Reset**: See `.same/PASSWORD_RESET_GUIDE.md`
- **Quick Tasks**: See `.same/QUICK_REFERENCE.md`
- **Technical Docs**: See `.same/README.md`

---

**Current Mode**: 🚀 **DEVELOPMENT** (Auth Bypassed)

**Last Updated**: Version 6
