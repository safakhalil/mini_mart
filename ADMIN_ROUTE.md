# Protected Admin Route Documentation

## Overview
The application now has a protected admin route at `/admin@BK` that requires authentication to access. This route replaces the previous admin portal setup and provides a simpler, more secure way to authenticate admin users.

## Authentication Methods

The `/admin@BK` route supports two authentication methods:

### 1. Secret Key Authentication
Access the route by providing a valid secret key:
- **Query Parameter**: `?secret=YOUR_SECRET_KEY`
- **Header**: `x-admin-secret: YOUR_SECRET_KEY`

### 2. Admin Role Authentication
Access the route by having admin role:
- **Header**: `x-user-role: admin`

## Configuration

### Environment Variable
Set the `ADMIN_SECRET_KEY` environment variable to customize the secret key:
```bash
ADMIN_SECRET_KEY="your-custom-secret-key"
```

If not set, the default secret key is: `BK-ADMIN-SECRET-2024`

## Examples

### Using Secret Key via Query Parameter
```bash
curl "http://localhost:3000/admin@BK?secret=BK-ADMIN-SECRET-2024"
```

### Using Secret Key via Header
```bash
curl -H "x-admin-secret: BK-ADMIN-SECRET-2024" http://localhost:3000/admin@BK
```

### Using Admin Role via Header
```bash
curl -H "x-user-role: admin" http://localhost:3000/admin@BK
```

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Access granted via secret key",
  "authenticated": true,
  "method": "secret_key"
}
```

### Error Response (403 Forbidden)
```json
{
  "success": false,
  "message": "Access denied. Valid admin role or secret key required.",
  "authenticated": false
}
```

## Security Notes

1. **Production Use**: In production, implement proper session/token validation for admin role authentication
2. **Secret Key Management**: Store the secret key securely using environment variables or a secrets manager
3. **HTTPS**: Always use HTTPS in production to prevent secret key interception
4. **Rate Limiting**: Consider implementing rate limiting to prevent brute force attacks
5. **Logging**: Log all access attempts to the admin route for security monitoring

## Changes Made

The following changes were made to implement the new protected admin route:

1. **Removed** old admin portal components from `src/App.tsx`
2. **Removed** admin-related imports and components from customer pages
3. **Removed** admin user state management from `src/context/StoreContext.tsx`
4. **Added** new protected route `/admin@BK` in `server.ts` with dual authentication support
5. **Updated** `.env.example` to include the new `ADMIN_SECRET_KEY` configuration

## Testing

The authentication logic has been tested with the following scenarios:
- ✅ No authentication (correctly denied)
- ✅ Valid secret key via query parameter (correctly granted)
- ✅ Invalid secret key (correctly denied)
- ✅ Admin role via header (correctly granted)
- ✅ Secret key via header (correctly granted)
- ✅ Custom secret key configuration (correctly granted)
