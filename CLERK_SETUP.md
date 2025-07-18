# Clerk Authentication Setup Guide

This project has been configured with Clerk authentication following the latest Next.js App Router guidelines.

## 🚀 Quick Start

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys from the dashboard

### 2. Configure Environment Variables

Update the `.env.local` file with your Clerk keys and approved emails:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Approved Emails (comma-separated list)
# Only these email addresses will be allowed to access the application
APPROVED_EMAILS=admin@yourcompany.com,manager@yourcompany.com,user@example.com
```

**Email Access Control**: Only users with email addresses listed in `APPROVED_EMAILS` can access the application. Leave this empty to allow all users.

### 3. Run the Application

```bash
pnpm dev
```

## 🔧 Features Implemented

### ✅ Authentication Components

- **Sign In/Sign Up Buttons**: Automatic authentication flows
- **User Button**: Profile management and sign out
- **Protected Routes**: Authentication required for main app features

### ✅ Route Protection

- **Home Page**: Shows different content for authenticated/unauthenticated users
- **Quotation Template**: Requires authentication to access
- **All API Routes**: Protected by default (require authentication + email approval)
- **Public API Routes**: Only health checks and webhooks remain public
- **Email Approval**: Only approved email addresses can access the application
- **Unauthorized Page**: Clear messaging for non-approved users

### ✅ Developer Experience

- **TypeScript Support**: Full type safety with Clerk
- **Server-Side Auth**: Middleware and API route protection
- **Client-Side Auth**: React hooks for user state management

## 📁 File Structure

```
middleware.ts              # Clerk middleware configuration
app/
  layout.tsx               # ClerkProvider wrapper
  page.tsx                 # Protected home page
  quotation-template/
    page.tsx               # Protected quotation page
  api/
    protected/
      route.ts             # Protected API route example
hooks/
  useAuth.ts               # Custom auth hook
```

## 🔐 Security Features

- **Middleware Protection**: `clerkMiddleware()` protects all routes
- **Server-Side Authentication**: API routes use `auth()` from `@clerk/nextjs/server`
- **Client-Side Guards**: `<SignedIn>` and `<SignedOut>` components
- **Automatic Redirects**: Seamless authentication flows

## 🎨 UI/UX Features

- **Beautiful Sign-In Flow**: Integrated with existing design system
- **User Profile**: Accessible via UserButton in header
- **Responsive Design**: Works on all device sizes
- **Loading States**: Proper handling of authentication state

## 🚦 Next Steps

1. **Customize Sign-In/Sign-Up**: Visit Clerk dashboard to customize forms
2. **Add Social Providers**: Enable Google, GitHub, etc. in Clerk dashboard
3. **User Metadata**: Extend user profiles with custom fields
4. **Organizations**: Add team/organization features if needed

## 📚 Documentation

- [Clerk Next.js Documentation](https://clerk.com/docs/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Clerk API Reference](https://clerk.com/docs/references/nextjs/overview)

## 🆘 Troubleshooting

### Common Issues

1. **Hydration Errors**: Make sure you're using `"use client"` in components that use Clerk hooks
2. **Environment Variables**: Verify your keys are correct and properly formatted
3. **Middleware Issues**: Ensure `middleware.ts` is at the root level (not in app directory)

### Getting Help

- Check the Clerk dashboard for real-time logs
- Visit [Clerk Discord](https://clerk.com/discord) for community support
- Review [Clerk's troubleshooting guide](https://clerk.com/docs/troubleshooting/overview)
