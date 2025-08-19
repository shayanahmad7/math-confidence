# Google OAuth Setup for Math Confidence

This guide explains how to configure Google OAuth authentication for the Math Confidence project.

## Prerequisites

1. A Google Cloud project
2. Access to your Supabase project dashboard

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

### Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: "Math Confidence"
   - User support email: Your email
   - Developer contact information: Your email
4. Add the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. Add your Supabase project domain: `flrcereucqznqvtgiykb.supabase.co`
6. Save and continue

### Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-production-domain.com` (for production)
5. Add authorized redirect URIs:
   - `https://flrcereucqznqvtgiykb.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret**

## Step 2: Supabase Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select the Math Confidence project
3. Go to **Authentication** > **Providers**
4. Find **Google** and click **Edit**
5. Enable Google provider
6. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
7. Save the configuration

## Step 3: Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://flrcereucqznqvtgiykb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Testing

1. Run the development server: `npm run dev`
2. Go to the login or signup page
3. Click "Sign in with Google" or "Sign up with Google"
4. You should be redirected to Google's consent screen
5. After authorization, you'll be redirected back to the dashboard

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**: Make sure the redirect URI in Google Cloud Console matches exactly with Supabase's callback URL
2. **"OAuth provider not enabled"**: Ensure Google provider is enabled in Supabase dashboard
3. **"Client ID not found"**: Verify the client ID and secret are correctly entered in Supabase

### Testing in Development

- Make sure `http://localhost:3000` is added to authorized JavaScript origins in Google Cloud Console
- The redirect URI should always point to your Supabase project domain, not localhost

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Google OAuth client secret secure
- Consider setting up additional security measures like domain verification for production

## Next Steps

After successful setup, you can:

1. Customize the Google sign-in button appearance
2. Add additional OAuth providers (GitHub, Facebook, etc.)
3. Implement user profile management
4. Add role-based access control
