# Google OAuth Setup for Math Confidence

## Overview
This guide sets up Google OAuth authentication for the Math Confidence project using **implicit flow** (the simpler approach).

## What We're Using
- **OAuth Flow**: Implicit Flow (no `redirectTo` needed)
- **Supabase**: For authentication backend
- **Next.js**: For the frontend

## Step 1: Google Cloud Console Setup

### 1.1 Create OAuth 2.0 Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application** as the application type

### 1.2 Configure Authorized JavaScript Origins
Add these URLs:
- `http://localhost:3001` (for local development)
- `https://math-confidence.com` (for production)

### 1.3 Configure Authorized Redirect URIs
Add these URLs:
- `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback` (Supabase's callback)
- `http://localhost:3001/auth/callback` (local development)
- `https://math-confidence.com/auth/callback` (production)

### 1.4 Get Client ID and Secret
Copy the **Client ID** and **Client Secret** - you'll need these for Supabase.

## Step 2: Supabase Dashboard Setup

### 2.1 Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Edit**
4. Enable the provider
5. Paste your **Client ID** and **Client Secret** from Google Cloud Console
6. Save the configuration

### 2.2 Configure Site URL
1. In **Authentication** → **Settings**
2. Set **Site URL** to: `https://math-confidence.com`
3. Set **Redirect URLs** to include:
   - `https://math-confidence.com/auth/callback`
   - `http://localhost:3001/auth/callback`

## Step 3: Environment Variables

Make sure your `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: How It Works

### Implicit Flow (What We're Using)
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth
3. User authenticates with Google
4. Google redirects back to Supabase
5. Supabase creates a session and redirects to your app
6. **No complex callback handling needed!**

### Why This Approach?
- **Simpler**: No `redirectTo` configuration needed
- **More reliable**: Supabase handles the OAuth flow
- **Less error-prone**: Fewer moving parts
- **Standard**: This is the recommended approach in Supabase docs

## Step 5: Testing

### Local Development
1. Run `npm run dev` (should start on port 3001)
2. Go to `http://localhost:3001`
3. Try Google sign-in
4. Should redirect to dashboard after successful authentication

### Production
1. Deploy to Vercel
2. Test Google sign-in on `https://math-confidence.com`
3. Should work without localhost redirects

## Troubleshooting

### Common Issues
1. **"Invalid redirect_uri"**: Check Google Cloud Console redirect URIs
2. **"Provider not enabled"**: Verify Google provider is enabled in Supabase
3. **"Client ID not found"**: Double-check Client ID in Supabase dashboard

### Debug Steps
1. Check browser console for errors
2. Verify Supabase project URL matches your environment variables
3. Ensure redirect URIs are exactly correct (no trailing slashes)
4. Check that Google OAuth is enabled in Supabase

## What We Fixed
- ❌ Removed complex `redirectTo` logic that was causing localhost redirects
- ❌ Simplified the callback route to use basic redirect logic
- ❌ Eliminated the PKCE flow complexity that wasn't needed
- ✅ Now using the standard implicit flow as recommended in Supabase docs
- ✅ Much simpler and more reliable implementation
