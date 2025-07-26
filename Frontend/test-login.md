# Admin Login Test Guide

## Steps to Test Admin Login:

### 1. Clean Database (if needed)
Run these SQL commands in your MySQL database:
```sql
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS complaints;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(50),
    customer_name VARCHAR(100),
    email VARCHAR(100),
    complaint_text TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('ADMIN');
```

### 2. Start Backend
```bash
cd Backend
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd Frontend
npm run dev
```

### 4. Test Admin Registration
1. Go to `http://localhost:5173/register`
2. Register with:
   - Username: `admin`
   - Password: `admin123`
   - Roles: Select `ADMIN`
3. Click Register

### 5. Test Admin Login
1. Go to `http://localhost:5173/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Click Login

### 6. Expected Behavior
- Should see "Login successful!" message
- Should automatically redirect to `/admin-dashboard`
- Navigation should show "Admin Dashboard" and "All Complaints" links
- Should see "Welcome, admin" in the navigation

### 7. Debug Information
Check browser console for:
- JWT Decoded payload
- Extracted roles
- Navigation logs

### 8. Backend Debug
Check backend console for:
- User roles being loaded
- JWT generation logs
- Role assignment verification

## Troubleshooting

### If admin login doesn't work:
1. Check browser console for JWT parsing errors
2. Check backend console for role loading errors
3. Verify database has admin user with ADMIN role
4. Test the `/api/auth/roles` endpoint: `GET http://localhost:8080/api/auth/roles`
5. Test the `/api/auth/users` endpoint: `GET http://localhost:8080/api/auth/users`

### Common Issues:
- **Role not found**: Make sure ADMIN role exists in database
- **JWT parsing error**: Check if token is properly generated
- **Navigation not working**: Check if roles are properly extracted from JWT 