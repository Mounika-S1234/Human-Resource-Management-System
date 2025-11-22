# HRMS Project Files

Complete file structure created for the Human Resource Management System (HRMS).

## Backend Files Created

```
backend/
├── .env                              # Environment configuration
├── .gitignore                       # Git ignore rules
├── package.json                     # Backend dependencies & scripts
└── src/
    ├── index.js                     # Express server entry point
    ├── db.js                        # Sequelize database connection
    ├── seed.js                      # Database seeding script
    │
    ├── models/
    │   ├── index.js                # Model associations
    │   ├── Organisation.js          # Organisation model
    │   ├── User.js                  # User model
    │   ├── Employee.js              # Employee model
    │   ├── Team.js                  # Team model
    │   ├── EmployeeTeam.js          # Employee-Team join model
    │   └── Log.js                   # Audit log model
    │
    ├── controllers/
    │   ├── authController.js        # Register & login logic
    │   ├── employeeController.js    # Employee CRUD logic
    │   ├── teamController.js        # Team CRUD logic
    │   └── logController.js         # Audit log logic
    │
    ├── routes/
    │   ├── auth.js                  # Auth endpoints
    │   ├── employees.js             # Employee endpoints
    │   ├── teams.js                 # Team endpoints
    │   └── logs.js                  # Log endpoints
    │
    └── middlewares/
        ├── authMiddleware.js        # JWT verification
        └── errorHandler.js          # Error handling middleware
```

## Frontend Files Created

```
frontend/
├── .gitignore                       # Git ignore rules
├── package.json                     # Frontend dependencies & scripts
├── public/
│   └── index.html                  # HTML template
│
└── src/
    ├── App.js                       # Main App component with routing
    ├── index.js                     # React entry point
    │
    ├── pages/
    │   ├── Login.jsx                # Login page
    │   ├── RegisterOrg.jsx          # Organisation registration
    │   ├── Dashboard.jsx            # Home dashboard
    │   ├── Employees.jsx            # Employee management page
    │   ├── Teams.jsx                # Team management page
    │   └── Logs.jsx                 # Audit logs viewer
    │
    ├── components/
    │   ├── EmployeeForm.jsx         # Modal form for employees
    │   └── TeamForm.jsx             # Modal form for teams
    │
    ├── services/
    │   └── api.js                   # Axios wrapper with auth interceptor
    │
    └── styles/
        ├── Global.css               # Global styles & utilities
        ├── Auth.css                 # Authentication pages styling
        ├── Dashboard.css            # Dashboard styling
        ├── Employees.css            # Employees page styling
        ├── Teams.css                # Teams page styling
        ├── Logs.css                 # Logs page styling
        └── Modal.css                # Modal & form styling
```

## Root Configuration Files

```
hrms-1/
├── README.md                        # Full documentation & API reference
├── QUICKSTART.md                    # Quick setup guide
└── PROJECT_FILES.md                 # This file
```

## Key Features

### Backend (Node.js + Express + PostgreSQL)
- ✅ Complete REST API with CRUD operations
- ✅ JWT-based authentication
- ✅ Multi-tenant organisation support
- ✅ Many-to-many employee-team relationships
- ✅ Comprehensive audit logging
- ✅ Error handling middleware
- ✅ CORS enabled for frontend integration
- ✅ Database seeding with sample data

### Frontend (React)
- ✅ React Router for navigation
- ✅ Axios for API calls with token injection
- ✅ Login & organisation registration
- ✅ Employee management (CRUD)
- ✅ Team management (CRUD)
- ✅ Employee-team assignments
- ✅ Audit log viewer with pagination
- ✅ Responsive design with CSS
- ✅ Form validation & error handling
- ✅ Local storage for JWT tokens

## Database Schema

The system uses 6 main tables:

1. **organisations** - Company/organisation records
2. **users** - User login accounts tied to organisations
3. **employees** - Employee records per organisation
4. **teams** - Team records per organisation
5. **employee_teams** - Join table for many-to-many relationships
6. **logs** - Complete audit trail of all operations

## Installation Dependencies

### Backend
- express (web framework)
- pg (PostgreSQL driver)
- sequelize (ORM)
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment variables)
- cors (cross-origin requests)
- nodemon (dev tool)

### Frontend
- react (UI library)
- react-dom (DOM rendering)
- react-router-dom (routing)
- axios (HTTP client)
- react-scripts (build tools)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new organisation
- `POST /api/auth/login` - User login

### Employees (Protected)
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Teams (Protected)
- `GET /api/teams` - List teams
- `GET /api/teams/:id` - Get single team
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:teamId/assign` - Assign employee
- `POST /api/teams/:teamId/unassign` - Remove assignment

### Logs (Protected)
- `GET /api/logs` - Get audit logs (paginated)

## Configuration Files

### backend/.env
Environment variables for database connection and JWT secret

### frontend/package.json
- Proxy set to http://localhost:5000 for API calls
- Scripts: start, build, test

## How to Use

1. **Setup Database**
   - Create PostgreSQL database: `hrms_db`
   - Update credentials in `backend/.env`

2. **Install Dependencies**
   ```
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Seed Database**
   ```
   cd backend && npm run seed
   ```

4. **Start Backend**
   ```
   cd backend && npm run dev
   ```

5. **Start Frontend**
   ```
   cd frontend && npm start
   ```

6. **Access Application**
   - Open http://localhost:3000
   - Login with: admin@techcompany.com / password123

## Security Measures

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Organisation data isolation
- Error messages don't expose sensitive info
- CORS enabled but can be restricted
- Input validation on backend

## Development Notes

- Backend uses Sequelize for all database operations
- Frontend uses React Router for client-side routing
- Axios interceptor automatically adds JWT to requests
- All CRUD operations are logged for audit trail
- Forms include validation and error handling
- Responsive CSS for desktop/tablet/mobile

## Files Not Included

The following are automatically generated/ignored:
- `node_modules/` (installed via npm)
- `.git/` (initialize with git init)
- Build output `frontend/build/`
- Environment secrets (use .env)

## Next Steps

1. Review `README.md` for complete documentation
2. Read `QUICKSTART.md` for running the app
3. Test API endpoints using Postman
4. Customize styling in `frontend/src/styles/`
5. Add additional features as needed

Enjoy building! 🚀
