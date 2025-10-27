# Cloudscape - Modern Fashion E-commerce

A full-stack e-commerce platform built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Backend Setup

1. Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the server directory with your configuration:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=no-reply@yourapp.com
PORT=5000
```

3. Seed the database with sample products:
```bash
node seed.js
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

2. Create a `.env` file in the client directory:
```env
VITE_API_BASE=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## 🌐 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Use `npm install; npm start` as the start command

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variables
4. Deploy!

### MongoDB Atlas Setup

1. Create a cluster on MongoDB Atlas
2. Get your connection string
3. Add IP addresses to whitelist
4. Update MONGO_URI in your environment variables

## 📦 Features

- 🔐 JWT Authentication
- 📧 Email notifications via Resend
- 🛍️ Product catalog with size selection
- 🛒 Shopping cart functionality
- 💳 Checkout process (coming soon)
- 📱 Responsive design

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email**: Resend
- **Deployment**: Vercel (frontend), Render (backend)

## 📝 Development Notes

- Run `npm run lint` in either directory to check for issues
- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default

## 🤝 Contributing

Contributions welcome! Please check out our issues page or submit a pull request.

## 📄 License

MIT