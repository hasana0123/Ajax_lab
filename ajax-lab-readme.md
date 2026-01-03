# AJAX Lab Project

A project demonstrating AJAX communication between frontend and backend without page reloads using React, Express, and PostgreSQL.

## Overview

This project implements asynchronous data communication between client and server. It demonstrates sending and receiving data without refreshing the page, similar to modern web applications like Facebook or Gmail.

## Technologies

- React - Frontend framework
- Axios - HTTP client for AJAX requests
- Express.js - Backend server
- PostgreSQL - Database

## Project Structure

```
my-fullstack-app/
├── backend/
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js
    │   └── App.css
    └── package.json
```

## Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running
- Basic understanding of JavaScript

## Installation

### PostgreSQL Setup

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql
```

In PostgreSQL shell:

```sql
CREATE DATABASE ajaxlab;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE ajaxlab TO myuser;
\q
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
DB_USER=myuser
DB_HOST=localhost
DB_NAME=ajaxlab
DB_PASSWORD=mypassword
DB_PORT=5432
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

Open two terminal windows.

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Access the application at http://localhost:3000

## Features

### Exercise 2 & 3: Data Transmission
Send numeric input to server which adds 20 and returns result without page reload.

### Exercise 4: Asynchronous vs Synchronous
Demonstrates difference between parallel and sequential request handling.

**Asynchronous**: Multiple requests execute simultaneously. Fast requests complete first.

**Synchronous**: Requests execute sequentially. Each waits for previous to complete.

### Database Integration
All calculations automatically saved to PostgreSQL database with timestamps.

### OTP Verification
Simulates one-time password verification. Use 123456 for successful verification.

### Social Features
Like counter and comment system demonstrating real-time updates without page refresh.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/hello | Connection test |
| POST | /api/add | Add 20 to input number |
| GET | /api/slow | Response with 5 second delay |
| GET | /api/fast | Immediate response |
| GET | /api/setup-database | Initialize database table |
| POST | /api/save-calculation | Store calculation |
| GET | /api/calculations | Retrieve all calculations |
| POST | /api/verify-otp | Verify OTP code |
| POST | /api/like | Increment like counter |
| GET | /api/likes | Get like count |
| POST | /api/comment | Add comment |
| GET | /api/comments | Retrieve comments |

## Testing

1. Test connection using "Test Backend Connection" button
2. Enter number in Exercise 2 & 3 section and submit
3. Run asynchronous requests and observe console output order
4. Run synchronous requests and observe sequential execution
5. Setup database and verify calculations are saved
6. Test OTP verification with correct and incorrect codes
7. Test like functionality and comment posting

## Troubleshooting

### Connection Failed
Verify backend is running on port 5000 and CORS is enabled.

### Database Connection Error
Check PostgreSQL service status and verify credentials in .env file.

### Module Not Found
Run npm install in both backend and frontend directories.

### Port Already in Use
Kill process using the port or specify different port.

## Key Concepts

### AJAX Communication
Asynchronous JavaScript and XML allows updating parts of a web page without reloading the entire page.

### Request Types
**Asynchronous**: Non-blocking. Allows multiple operations simultaneously. \
**Synchronous**: Blocking. Operations execute one after another.

### Data Flow
1. User triggers action in frontend
2. Axios sends HTTP request to backend
3. Express server processes request
4. PostgreSQL stores/retrieves data if needed
5. Server sends response
6. React updates UI with new data

