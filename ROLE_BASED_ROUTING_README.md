# Role-Based Routing System

## Overview

This document describes the role-based routing system implemented for DecentraMind's healthcare platform. The system provides secure access control for different user types (admin, provider, patient, guest) with both client-side and server-side validation.

## Architecture

### 1. User Roles

```typescript
export type UserRole = 'admin' | 'provider' | 'patient' | 'guest';
```

- **Admin**: Full system access, can manage hospitals and users
- **Provider**: Healthcare professionals (doctors, nurses, medical staff)
- **Patient**: Patients accessing their health portal
- **Guest**: Limited access to public pages only

### 2. Protected Routes

| Route | Required Roles | Description |
|-------|----------------|-------------|
| `/provider/workspace` | `provider`, `admin` | Healthcare provider dashboard |
| `/patient/pwa` | `patient`, `admin` | Patient portal |
| `/admin/hospital` | `admin` | Hospital administration |
| `/onboarding/hospital` | `admin` | Hospital setup wizard |

## Implementation Components

### 1. Role Check Hook (`app/hooks/useRoleCheck.ts`)

Client-side role validation hook with the following features:

- **useRoleCheck**: Generic hook for any role validation
- **useProviderAccess**: Specific hook for provider routes
- **usePatientAccess**: Specific hook for patient routes
- **useAdminAccess**: Specific hook for admin routes

```typescript
// Example usage
const { user, isLoading, isAuthorized } = useProviderAccess();

if (isLoading) return <LoadingSpinner />;
if (!isAuthorized) return <UnauthorizedMessage />;
```

### 2. Middleware (`middleware.ts`)

Server-side route protection that runs before page rendering:

- Intercepts requests to protected routes
- Validates user role from cookies/headers
- Redirects unauthorized users to `/unauthorized`
- Preserves attempted URL for post-login redirect

### 3. Unauthorized Page (`app/unauthorized/page.tsx`)

Professional error page for unauthorized access:

- Clear error messaging
- Navigation options (go back, go home, login)
- Development mode role testing buttons
- Responsive design with animations

### 4. Login Page (`app/login/page.tsx`)

Demo login system for testing different roles:

- Role selection interface
- Visual role descriptions and access levels
- Automatic redirection based on selected role
- Development mode indicators

## Usage Examples

### Protecting a Page Component

```typescript
'use client';

import { useProviderAccess } from '../hooks/useRoleCheck';

const ProtectedPage: React.FC = () => {
  const { user, isLoading, isAuthorized } = useProviderAccess();

  if (isLoading) {
    return <div>Verifying access...</div>;
  }

  if (!isAuthorized) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {/* Protected content */}
    </div>
  );
};
```

### Testing Different Roles

1. **Via Login Page**: Visit `/login` and select a role
2. **Via Browser Console**: 
   ```javascript
   localStorage.setItem('userRole', 'provider');
   window.location.reload();
   ```
3. **Via Development Mode**: Use the role testing buttons on `/unauthorized`

## Security Features

### Client-Side Protection
- Role validation on component mount
- Automatic redirect for unauthorized access
- Loading states during role verification
- Graceful error handling

### Server-Side Protection
- Middleware intercepts requests before rendering
- Cookie/header-based role validation
- Immediate redirect for unauthorized access
- No sensitive data exposed to unauthorized users

### Development Features
- Role testing utilities
- Visual role indicators
- Easy role switching for testing
- Comprehensive error messages

## File Structure

```
app/
├── hooks/
│   └── useRoleCheck.ts          # Role validation hooks
├── unauthorized/
│   └── page.tsx                 # Unauthorized access page
├── login/
│   └── page.tsx                 # Demo login page
├── provider/
│   └── workspace/
│       └── page.tsx             # Protected provider page
├── patient/
│   └── pwa/
│       └── page.tsx             # Protected patient page
└── admin/
    └── hospital/
        └── page.tsx             # Protected admin page

middleware.ts                     # Server-side route protection
```

## Testing Scenarios

### 1. Unauthorized Access
- Visit `/provider/workspace` without proper role
- Should redirect to `/unauthorized?from=/provider/workspace`

### 2. Authorized Access
- Set role to 'provider' via login page
- Visit `/provider/workspace`
- Should load the page successfully

### 3. Role Switching
- Login as 'patient'
- Try to access `/provider/workspace`
- Should be denied access

### 4. Admin Override
- Login as 'admin'
- Should be able to access all protected routes

## Production Considerations

### Authentication Integration
Replace the mock authentication system with:
- JWT tokens for role validation
- OAuth providers (Auth0, Firebase Auth)
- Session management
- Multi-factor authentication

### Security Enhancements
- Rate limiting on login attempts
- CSRF protection
- Secure cookie handling
- Audit logging for access attempts

### Performance Optimizations
- Role caching
- Lazy loading of protected components
- Optimized middleware execution
- CDN integration for static assets

## Error Handling

The system provides comprehensive error handling:

- **Loading States**: Smooth transitions during role verification
- **Unauthorized Access**: Clear messaging and navigation options
- **Network Errors**: Graceful fallbacks and retry mechanisms
- **Invalid Roles**: Automatic role validation and correction

## Browser Compatibility

- Modern browsers with ES6+ support
- LocalStorage for role persistence
- CSS Grid and Flexbox for layouts
- Framer Motion for animations

## Future Enhancements

- Multi-tenant role management
- Granular permission system
- Role hierarchy support
- Audit trail and logging
- API rate limiting
- Real-time role updates
