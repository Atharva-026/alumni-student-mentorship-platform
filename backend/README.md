
### 1️⃣8️⃣ FILE: `backend/README.md`

Backend documentation:
````markdown
# Alumni-Student Mentorship Platform - Backend API

## Overview
Node.js + Express backend API for the Alumni-Student Mentorship Platform.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (free account at mongodb.com)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file with:
````
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mentorship
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000