# SkinCare Backend API

A RESTful API backend for skincare user management built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- MongoDB database with Mongoose ODM
- TypeScript for type safety
- RESTful API design

## Requirements

- Node.js 16+
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```
git clone <repository-url>
cd skincare-backend
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skincare_db
NODE_ENV=development
```

4. Start the development server
```
npm run dev
```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/signup` - Register a new user (alternative endpoint)
- `POST /api/users/login` - Authenticate user & get token
- `GET /api/users/profile` - Get user profile (protected)

## Scripts

- `npm run build` - Build the TypeScript code
- `npm run start` - Start the production server
- `npm run dev` - Start the development server with hot-reloading

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Nodemon (development) 