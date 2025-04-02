# Task Management Backend API

A RESTful API backend for a task management application built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup, login, logout)
- User management 
- Task management (create, read, update, delete)
- File uploads for task attachments
- Role-based access control

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs
- **File Upload**: Multer

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)

### Installation Steps

1. Clone the repository
   ```
   git clone https://github.com/sakayat/taskmanagement-backend
   cd taskmanagement-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=7000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. For production
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

