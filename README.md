## Problem Statement  
**Develop a Skill Swap Platform — a mini application that enables users to list their skills and request others in return**

## Team Name  
**Laksha (Team 1852)**

## Team Email  
**pranaygingle@gmail.com,majumdardebdutta@gmail.com,bhoirpranay24@gmail.com,dadialanavjotsingh@gmail.com**

---


# SkillSwap Platform

A full-stack skill-sharing platform where users can exchange skills with each other.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   # The app will create the 'skillswap' database automatically
   ```

3. **Run both frontend and backend simultaneously:**
   ```bash
   npm run dev
   ```

This will start:
- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:5173

## 🏗️ Project Structure

```
skillswap-platform/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── db/            # Database connection
│   └── package.json
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript types
│   └── package.json
└── package.json           # Root package.json
```

## 🔧 Development

### Running Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Environment Variables

**Backend (.env):**
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8080/api
```

## 🎯 Features

- ✅ **User Authentication** - JWT-based login/register
- ✅ **Profile Management** - Complete user profiles with skills
- ✅ **Skill Browsing** - Search and discover users by skills
- ✅ **Swap Requests** - Send and manage skill swap requests
- ✅ **Rating System** - Rate and review completed swaps
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Responsive Design** - Works on all devices

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users by skill
- `GET /api/users/:id` - Get public user profile

### Swaps
- `POST /api/swaps` - Create swap request
- `GET /api/swaps` - Get user's swaps
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap
- `DELETE /api/swaps/:id` - Delete swap
- `POST /api/swaps/:id/feedback` - Submit feedback

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Custom hooks for state management
- Real-time API integration

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📝 License

MIT License - feel free to use this project for your own purposes! 
