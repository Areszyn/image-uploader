# Image Uploader

## Setup
1. Rename `.env.local.example` to `.env.local`
2. Add your Supabase credentials
3. Run `npm install`
4. Run `npm run dev`

## Supabase Setup
1. Create storage bucket named `uploads`
2. Enable public access with this SQL:
```sql
create policy "Allow public read access"
on storage.objects for select
using ( bucket_id = 'uploads' );
