# HRMS Quick Start Guide

## Prerequisites
- PostgreSQL must be installed and running
- Node.js v16+ installed
- npm or yarn package manager

## One-Time Setup

### Step 1: PostgreSQL Database Setup

Make sure PostgreSQL is running. Then create the database:

**Windows (PowerShell):**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Inside psql console:
CREATE DATABASE hrms_db;
\q
```

**Or using SQL Client:**
Create a new database named `hrms_db`

### Step 2: Backend Configuration

Edit `backend/.env` with your PostgreSQL credentials:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_postgres_password
DB_NAME=hrms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

### Step 3: Seed Database (One Time)

```powershell
cd backend
npm run seed
```

This will:
- Create all database tables
- Insert sample data
- Create test organisation and admin user

## Running the Application

### Terminal 1 - Start Backend Server

```powershell
cd backend
npm run dev
```

You should see:
```
Database connection established
Database tables synced
Server running on port 5000
```

### Terminal 2 - Start Frontend Application

```powershell
cd frontend
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## Login Credentials

After seeding the database, use these credentials to login:

- **Email**: admin@techcompany.com
- **Password**: password123

## What's Seeded

The seed script creates:
- 1 Organisation: "Tech Company Inc."
- 1 Admin User
- 3 Sample Employees: John Doe, Jane Smith, Bob Johnson
- 2 Sample Teams: Engineering, Marketing
- Employee-Team Assignments

## Testing Endpoints

### Using Postman or curl

1. **Login to get JWT token**
   ```
   POST http://localhost:5000/api/auth/login
   Body:
   {
     "email": "admin@techcompany.com",
     "password": "password123"
   }
   ```

2. **Copy token from response and add to Authorization header**
   ```
   Authorization: Bearer <TOKEN_HERE>
   ```

3. **Test CRUD Endpoints**
   ```
   GET http://localhost:5000/api/employees
   GET http://localhost:5000/api/teams
   GET http://localhost:5000/api/logs
   ```

## Common Issues

### Issue: "Cannot connect to database"
**Solution**: 
- Ensure PostgreSQL is running
- Check DB credentials in `.env`
- Verify database `hrms_db` exists

### Issue: "Port 5000 already in use"
**Solution**: 
- Change PORT in `backend/.env` to another port (e.g., 5001)
- Or kill process using port 5000

### Issue: "Port 3000 already in use"
**Solution**:
```powershell
$env:PORT=3001; npm start
```

### Issue: "Token expired" while testing
**Solution**: 
- Login again to get a new token
- Tokens expire after 8 hours

## Project Features

✅ **Authentication**: JWT-based auth with secure password hashing  
✅ **Organisations**: Multi-tenant with data isolation  
✅ **Employees**: Full CRUD operations  
✅ **Teams**: Create and manage teams  
✅ **Assignments**: Manage employee-team relationships  
✅ **Audit Logging**: Complete operation history  
✅ **Responsive UI**: Modern React interface  

## Directory Structure

```
hrms-1/
├── backend/
│   ├── src/
│   │   ├── controllers/      ← API logic
│   │   ├── models/           ← Database models
│   │   ├── routes/           ← API endpoints
│   │   ├── middlewares/      ← Auth & error handling
│   │   ├── index.js          ← Server entry
│   │   └── seed.js           ← Database seeding
│   ├── package.json
│   └── .env                  ← Configuration (NOT in git)
│
├── frontend/
│   ├── src/
│   │   ├── pages/            ← React pages
│   │   ├── components/       ← React components
│   │   ├── services/         ← API client
│   │   ├── styles/           ← CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md                 ← Full documentation
```

## Frontend Pages

- **Login** (`/login`) - User authentication
- **Register** (`/register`) - Organisation registration
- **Dashboard** (`/dashboard`) - Home page with quick links
- **Employees** (`/employees`) - Employee management
- **Teams** (`/teams`) - Team management
- **Logs** (`/logs`) - Audit log viewer

## Next Steps

1. ✅ Start the application
2. ✅ Create a new organisation (register)
3. ✅ Or login with demo credentials
4. ✅ Add employees and teams
5. ✅ Assign employees to teams
6. ✅ View audit logs

## Tips

- Token is stored in browser's localStorage
- All API calls automatically include the token
- Organisation ID is automatically determined from token
- Each organisation's data is completely isolated

## Support

Refer to:
- `README.md` for full API documentation
- Postman collection for endpoint testing
- Browser console for debugging

Enjoy using HRMS! 🚀
