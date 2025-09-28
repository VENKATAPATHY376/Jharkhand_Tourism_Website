# Jharkhand Tourism - MySQL Database Setup

## 🗄️ Database Configuration

### Prerequisites
1. MySQL server installed and running
2. Database credentials ready
3. Network access to your MySQL server

### Setup Instructions

#### 1. Environment Configuration
Update the `.env` file in the `backend` directory with your MySQL database connection details:

```env
# Replace with your actual MySQL database URL
DATABASE_URL=mysql://username:password@hostname:port/database_name

# Example for local MySQL:
DATABASE_URL=mysql://root:yourpassword@localhost:3306/jharkhand_tourism

# Example for remote MySQL (like AWS RDS, DigitalOcean, etc.):
DATABASE_URL=mysql://admin:password@your-db-host.amazonaws.com:3306/jharkhand_tourism
```

#### 2. Database Creation
Create a database named `jharkhand_tourism` (or use your preferred name):

```sql
CREATE DATABASE jharkhand_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. Tables (Auto-Created)
The application will automatically create the following tables when you start the server:

- **users** - User accounts with hashed passwords
- **packages** - Tourism packages
- **bookings** - User bookings

### 🔐 Security Features

#### Password Security
- ✅ **bcrypt hashing** with 12 salt rounds
- ✅ **No plain text storage** - passwords are hashed before database insertion
- ✅ **Secure comparison** using bcrypt.compare()
- ✅ **Auto-hashing** on user creation and password updates

#### Database Security
- ✅ **Prepared statements** via Sequelize ORM (prevents SQL injection)
- ✅ **Input validation** on all user inputs
- ✅ **Connection pooling** for performance and security
- ✅ **SSL support** for remote databases

### 📊 Sample Data
The application will automatically create sample tourism packages on first run:
- Hundru Falls Adventure
- Netarhat Sunrise Trek  
- Betla National Park Safari

### 🚀 Starting the Application

1. Ensure your MySQL database is running
2. Update the `DATABASE_URL` in `.env`
3. Start the application:
```bash
npm run dev
```

The application will:
1. ✅ Connect to MySQL database
2. ✅ Create/sync tables automatically
3. ✅ Insert sample data if needed
4. ✅ Start the API server on port 5000

### 📱 Testing Login/Registration

#### Registration Test
```javascript
// POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com", 
  "password": "password123",
  "phone": "1234567890"
}
```

#### Login Test  
```javascript
// POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 🔍 Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  phone VARCHAR(15) NOT NULL,
  role ENUM('user', 'admin', 'tour_operator') DEFAULT 'user',
  avatar_url VARCHAR(500) DEFAULT '/uploads/avatars/default.jpg',
  is_email_verified BOOLEAN DEFAULT FALSE,
  preferences JSON,
  address JSON,
  emergency_contact JSON,
  travel_history JSON,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 🛠️ Troubleshooting

#### Connection Issues
1. Verify MySQL server is running
2. Check DATABASE_URL format
3. Ensure database exists
4. Verify network connectivity
5. Check firewall settings

#### Authentication Issues  
1. Password is automatically hashed - no manual hashing needed
2. Use plain text password for login
3. Check console logs for detailed error messages

### 🌐 Production Deployment

For production, use a managed MySQL service:
- **AWS RDS**
- **Google Cloud SQL** 
- **DigitalOcean Managed Databases**
- **Azure Database for MySQL**

Update `DATABASE_URL` with your production database connection string.

---

## ✅ Migration Complete

✅ **Removed**: MongoDB dependencies  
✅ **Removed**: In-memory database  
✅ **Added**: MySQL with Sequelize ORM  
✅ **Added**: Proper password hashing  
✅ **Added**: Auto-table creation  
✅ **Added**: Sample data initialization  

Your application now uses MySQL exclusively for all data storage with proper password security!