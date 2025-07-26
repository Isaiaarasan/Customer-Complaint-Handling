# Debug Endpoint Test Guide

## Issue
Still getting 403 Forbidden errors even after JWT filter fixes.

## Debug Strategy
1. Simplified security configuration to allow any authenticated user
2. Added debug endpoint to test if requests reach the backend
3. Added logging to getAllComplaints endpoint

## Changes Made

### 1. Simplified SecurityConfig
- Changed from `hasAnyRole("ADMIN", "USER")` to `authenticated()`
- This allows any authenticated user to access complaints

### 2. Added Debug Endpoint
- `/api/complaints/debug` - Tests if requests reach the backend
- Shows authentication status

### 3. Enhanced Logging
- Added console logs to `getAllComplaints` method
- Will show when endpoint is called and how many complaints found

## Testing Steps

### Step 1: Restart Backend
```bash
cd Backend
mvn spring-boot:run
```

### Step 2: Test Debug Endpoint
1. Open browser console
2. Run this command:
```javascript
fetch('/api/complaints/debug', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.text()).then(console.log)
```

### Step 3: Check Backend Console
Look for:
- JWT filter debug messages
- "getAllComplaints endpoint called"
- "Found X complaints"

### Step 4: Test Frontend
1. Login as admin
2. Navigate to "View All Complaints"
3. Check if complaints load

## Expected Results

### If Debug Endpoint Works:
- Should see "Debug endpoint reached! User: admin"
- Backend console shows JWT filter logs
- Complaints should load

### If Debug Endpoint Fails:
- Still getting 403 means JWT filter issue
- Need to check backend logs for JWT filter messages

## Troubleshooting

### Issue: Still 403 on debug endpoint
**Solution**: JWT filter not working properly
- Check backend console for JWT filter logs
- Verify token is being sent correctly

### Issue: Debug works but complaints don't load
**Solution**: Database or service layer issue
- Check backend console for "getAllComplaints endpoint called"
- Verify complaint service is working

### Issue: No backend logs at all
**Solution**: Backend not running or not restarted
- Make sure backend is running on port 8080
- Check if changes were applied

## Next Steps

1. **Test debug endpoint** to isolate the issue
2. **Check backend console** for detailed logs
3. **Verify JWT filter** is working properly
4. **Test complaints endpoint** once debug works 