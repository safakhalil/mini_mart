# GitHub & Vercel Deployment Guide

## Step 1: Push to GitHub

Since the repository requires authentication, you'll need to push manually:

### Option A: Using GitHub Personal Access Token
1. Create a Personal Access Token on GitHub:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select "repo" scope
   - Copy the generated token

2. Push to GitHub:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/safakhalil/mini_mart.git
git push -u origin main
```

### Option B: Using GitHub CLI (if available)
```bash
gh auth login
git push -u origin main
```

### Option C: Using SSH
```bash
git remote set-url origin git@github.com:safakhalil/mini_mart.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. When prompted:
   - Set up and deploy? → **Yes**
   - Link to existing project? → **No** (first time)
   - Project name → **mini-mart** (or your preferred name)
   - Directory → **./** (current directory)

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from GitHub:
   - Select the `mini_mart` repository
   - Configure settings:
     - **Framework Preset**: Other
     - **Build Command**: `bun run build`
     - **Output Directory**: `dist`
     - **Install Command**: `bun install`
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable key
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `GEMINI_API_KEY`: Your Gemini API key (optional)
   - `VITE_ADMIN_SECRET_KEY`: Your admin secret key (default: BK-ADMIN-SECRET-2024)
   - `ADMIN_SECRET_KEY`: Server-side admin secret key (should match VITE_ADMIN_SECRET_KEY)
5. Click "Deploy"

## Step 3: Configure Environment Variables in Vercel

After deployment, add these environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://jvepencwvugjszxvsmgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_4qmEAAKSqK2JkCVvTaq2RQ_kFPZz2Zn
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZXBlbmN3dnVnanN6eHZzbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzY3NjAsImV4cCI6MjEwMzE1Mjc2MH0.FO0f-ngsAY1B-ieFe_tx8SljJKnmKlw8dUmJEjRl5gs
GEMINI_API_KEY=your_gemini_api_key_here
VITE_ADMIN_SECRET_KEY=BK-ADMIN-SECRET-2024
ADMIN_SECRET_KEY=BK-ADMIN-SECRET-2024
```

## Step 4: Optional - Set Up Supabase Database

If you want to use Supabase for persistent data:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-schema.sql`
4. Paste and run the query
5. Run the seed script locally or set up a database seeding function

## Current Status

✅ **Git repository initialized**
✅ **All files committed**
✅ **Vercel configuration added**
✅ **Remote configured for GitHub**

⏳ **Waiting for GitHub authentication**
⏳ **Waiting for Vercel deployment**

## Troubleshooting

### GitHub Push Issues
- If you get authentication errors, use the Personal Access Token method
- Make sure the repository exists at https://github.com/safakhalil/mini_mart

### Vercel Build Issues
- Ensure `bun` is available in the build environment
- Check that all dependencies are in `package.json`
- Verify the build command works locally: `bun run build`

### Environment Variables
- Make sure to add environment variables in Vercel dashboard
- Variables with `NEXT_PUBLIC_` prefix are available in the browser
- Server-side variables are only available on the server

## After Deployment

Once deployed:
1. Test the application at the provided Vercel URL
2. Check that all API endpoints work correctly
3. Verify Supabase connection (if configured)
4. Test the admin authentication:
   - Navigate to `YOUR_URL/?admin=true` to access admin login
   - Enter the admin secret key configured in environment variables
   - Default secret key: `BK-ADMIN-SECRET-2024`
   - Alternatively, use `YOUR_URL/?secret=BK-ADMIN-SECRET-2024` for direct access