# 403 Forbidden Fix Test Guide

## Issue Description
The admin complaints page was returning 403 Forbidden error even though the user was authenticated.

## Root Cause
The security configuration was not properly set up for role-based authorization on the complaints endpoints.

## Fixes Applied

### 1. Updated SecurityConfig
- Added proper role-based authorization for complaints endpoints
- Added `hasAnyRole("ADMIN", "USER")` for complaints access
- Added missing `httpBasic(Customizer.withDefaults())`

### 2. Added Debug Endpoint
- Created `/api/auth/debug` endpoint to check user authentication and roles
- Enhanced error handling and logging

### 3. Improved Frontend Debugging
- Updated test authentication function to use debug endpoint
- Added better error messages and logging

## Testing Steps

### Step 1: Restart Backend
```bash
cd Backend
mvn spring-boot:run
```

### Step 2: Test Authentication
1. Login as admin user
2. Go to Admin Dashboard
3. Click "View All Complaints"
4. Click "Test Authentication" button
5. Check the toast message for user roles

### Step 3: Check Debug Information
1. Expand "Authentication Debug Info" section
2. Verify token exists and has proper length
3. Check browser console for detailed logs

### Step 4: Expected Results
- Should see "Auth test successful!" with user roles
- Should see complaints list (even if empty)
- Should NOT see 403 Forbidden errors
- Should see proper debug information

## Debug Information

### Backend Console
Look for:
- User authentication logs
- Role loading logs
- JWT generation logs

### Frontend Console
Look for:
- API Request logs with token status
- Auth debug response
- Any error messages

### Test Endpoints
- `GET /api/auth/debug` - Check current user auth
- `GET /api/auth/roles` - Check available roles
- `GET /api/auth/users` - Check all users and their roles

## Common Issues & Solutions

### Issue: Still getting 403
**Solution**: 
1. Check if user has ADMIN role in database
2. Verify JWT token contains correct roles
3. Check backend console for authentication logs

### Issue: No roles in JWT
**Solution**:
1. Re-register admin user with ADMIN role
2. Check if roles are properly saved in database
3. Verify CustomUserDetailsService is loading roles correctly

### Issue: Token expired
**Solution**:
1. Login again to get fresh token
2. Check token expiration time in JWT payload

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Admin can login successfully
- [ ] "Test Authentication" shows correct roles
- [ ] No 403 Forbidden errors
- [ ] Complaints page loads properly
- [ ] Debug information shows correctly
- [ ] Console logs show proper authentication flow 