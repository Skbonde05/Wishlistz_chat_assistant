# 🛍️ Wishlistz – AI Powered Shopping Assistant Chatbot

Wishlistz is a modular and scalable **AI-powered shopping assistant chatbot** designed to provide intelligent and interactive shopping assistance through a chat-based interface.

It helps users with:

- 🎁 Gift Planning  
- ✈️ Trip Planning  
- 🎨 Theme Suggestions  
- ❤️ Wishlist Management  
- 🧭 Smart Navigation inside the app  
- 🤖 Personalized Recommendations  

The project follows a clean **Frontend–Backend architecture** and is built for scalability and real-world deployment.

---

## 🌐 Live Deployment

### 🔹 Frontend  
👉 https://wishlistz-chat-assistant-glfy.vercel.app/

### 🔹 Backend API  
👉 https://wishlistz-chat-assistant-jysd.onrender.com/

---

## 🧱 Tech Stack

### 🎨 Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla JS)

### ⚙️ Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

---

## 📂 Project Structure

```
Wishlistz/
│
├── frontend/      # UI (HTML, CSS, JS)
├── backend/       # API & Server logic
├── .env.example   # Environment variables template
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/wishlistz.git
cd wishlistz
```

---

## 🖥️ Running the Frontend

The frontend is built using pure HTML, CSS, and JavaScript.

### Steps:

1. Open the `frontend` folder  
2. Open `index.html` in your browser  

✅ No server setup required for frontend.

---

## ⚙️ Running the Backend

### 🔹 Step 1: Navigate to Backend Folder

```bash
cd backend
```

### 🔹 Step 2: Install Dependencies

```bash
npm install
```

### 🔹 Step 3: Setup Environment Variables

Rename:

```
.env.example → .env
```

Fill required values inside `.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
HUGGINGFACE_API_KEY=your_api_key
```

### 🔹 Step 4: Start the Server

For development:

```bash
nodemon server.js
```

Or:

```bash
node server.js
```

Backend will run at:

```
http://localhost:PORT
```

---

## ✨ Key Features

- Modular AI-based planner system  
- Separate controllers for Gift / Trip / Theme  
- REST API architecture  
- MongoDB database integration  
- Scalable folder structure  
- Production deployment on Vercel & Render  

---

## 👥 Contributors

This project was developed as a group collaboration.

---

## 📌 Future Improvements

- Payment Gateway Integration  
- User Authentication & Authorization  
- Admin Dashboard  
- Advanced AI Recommendation Engine  
- Product Filtering & Search  

---

⭐ If you like this project, consider giving it a star!
