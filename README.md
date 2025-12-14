# 🛍️ Wishlistz Backend  
A modular, scalable backend for the Wishlistz Shopping Assistant Chatbot.  
Built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.  

The system powers intelligent shopping assistance including:
- Personalized recommendations  
- Trip/Gift/Theme planning  
- Chat-based interaction  
- Navigation inside app  
- Wishlist & user activity tracking  

---

## 🚀 Features

### 🔹 Chat System  
- Understands user messages using custom NLU  
- Supports shopping queries (trending, search, category-based)  
- Handles planners (Trip, Gift, Theme)  
- Navigation queries (e.g., "Where is men's section?")  

### 🔹 Planner Engine  
- **Trip Planner** – suggests checklist + missing items  
- **Gift Planner** – suggests gifts by age, relation, budget  
- **Theme Planner** – outfits, decoration, color theme suggestions  

### 🔹 Recommendation Engine  
- Personalized recommendations  
- Trending product suggestions  
- Gap-based recommendations (based on user history & wishlist)  

### 🔹 User & Product Management  
- Auth (JWT)  
- Wishlist  
- UserActivity logs  
- Product catalog  

### 🔹 MongoDB + Mongoose  
Clean schemas for all business entities.

---

## 🏗️ System Architecture

Frontend (HTML, CSS, JS)
↓ API Requests (REST)
Node.js + Express Backend
↓
Routes → Controllers → Services → Models
↓
MongoDB Atlas (wishlistz_chatbot)

yaml
Copy code

---
