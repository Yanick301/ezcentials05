-- Create the storage bucket for receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files to the receipts bucket
-- They can only upload to their own folder (handled by naming convention in frontend usually, but here we allow general upload for simplicity or enforce path)
-- Adjusting to allow authenticated upload to any path for now, but best practice is to restrict path
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'receipts' );

-- Policy to allow anyone to view receipts (since they are public links)
-- OR restrict to authenticated users if privacy is needed.
-- Since the bucket is public, the objects are accessible via public URL if known.
-- This policy allows "Select" via API.
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'receipts' );

-- Optional: Allow users to update/delete their own files if needed
-- CREATE POLICY "Allow individual delete" ...
