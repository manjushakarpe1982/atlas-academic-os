-- ============================================================
-- ATLAS ACADEMIC OS — COMPLETE SETUP FOR PROFILE PICTURES
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- ── STEP 1: Add profile_picture_url column to users table ──
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_profile_picture_url ON public.users(profile_picture_url);

-- ── STEP 2: Create storage policies ──

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow users to upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own photos" ON storage.objects;

-- Policy 1: Allow authenticated users to upload to their folder
CREATE POLICY "Allow users to upload profile pictures"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow public to read all profile pictures
CREATE POLICY "Allow public read profile pictures"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-pictures');

-- Policy 3: Allow users to delete their own photos
CREATE POLICY "Allow users to delete their own photos"
ON storage.objects
FOR DELETE
USING (
  auth.role() = 'authenticated'
  AND bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow users to update their own photos
CREATE POLICY "Allow users to update their own photos"
ON storage.objects
FOR UPDATE
WITH CHECK (
  auth.role() = 'authenticated'
  AND bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if profile_picture_url column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'profile_picture_url';

-- Check if storage policies were created
SELECT policy_name, definition
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policy_name LIKE '%profile%'
ORDER BY policy_name;

-- ============================================================
-- ALL DONE! ✅
-- ============================================================
-- You can now:
-- 1. Create Supabase Storage bucket named "profile-pictures"
-- 2. Make it PUBLIC
-- 3. Test file uploads from the frontend
