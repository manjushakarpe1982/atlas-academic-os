# Supabase Storage Setup for Profile Pictures

## Create Storage Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **Create a new bucket**
3. Name: `profile-pictures`
4. Make it **Public** (so images can be accessed via public URL)
5. Click **Create bucket**

## Bucket Policies (Security Rules)

### Allow Authenticated Users to Upload

Go to the bucket policies and add:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Allow users to upload profile pictures" ON storage.objects
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id = 'profile-pictures'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Allow Public Read Access

```sql
-- Allow public to read profile pictures
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');
```

### Allow Users to Delete Their Own Photos

```sql
-- Allow users to delete their own photos
CREATE POLICY "Allow users to delete their own photos" ON storage.objects
  FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'profile-pictures'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Environment Variables

Make sure your `.env.local` has Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## API Endpoint

The backend will handle uploads at:

```
POST /api/auth/me/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>
```

## Image URL Format

After upload, images will be accessible at:

```
https://your-project.supabase.co/storage/v1/object/public/profile-pictures/{user_id}/{filename}
```

## Testing Upload

```bash
curl -X POST http://localhost:8000/api/auth/me/profile-picture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

Expected response:

```json
{
  "message": "Profile picture updated successfully",
  "profile_picture_url": "https://your-project.supabase.co/storage/v1/object/public/profile-pictures/..."
}
```
