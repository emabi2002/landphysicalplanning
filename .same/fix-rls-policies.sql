-- ============================================
-- FIX: Row Level Security Policies
-- ============================================
-- Run this if you're seeing empty data in the Legal Requests page

-- First, check if policies exist and drop them if needed
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.legal_planning_requests;
DROP POLICY IF EXISTS "Allow all for anonymous users" ON public.legal_planning_requests;

-- Disable RLS temporarily for testing (IMPORTANT: Re-enable for production!)
ALTER TABLE public.legal_planning_requests DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, use these policies instead:
--
-- ALTER TABLE public.legal_planning_requests ENABLE ROW LEVEL SECURITY;
--
-- -- Policy for authenticated users
-- CREATE POLICY "Enable all for authenticated users"
--   ON public.legal_planning_requests
--   FOR ALL
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);
--
-- -- Policy for service role (bypass RLS)
-- CREATE POLICY "Enable all for service role"
--   ON public.legal_planning_requests
--   FOR ALL
--   TO service_role
--   USING (true)
--   WITH CHECK (true);
--
-- -- Policy for anon users (for development mode)
-- CREATE POLICY "Enable read for anon users"
--   ON public.legal_planning_requests
--   FOR SELECT
--   TO anon
--   USING (true);

-- Verify the data exists
SELECT 'Data verification:' AS status;
SELECT COUNT(*) AS total_records FROM public.legal_planning_requests;
SELECT request_number, subject, status FROM public.legal_planning_requests ORDER BY created_at DESC LIMIT 5;
