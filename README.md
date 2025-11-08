Vibe Commerce - Shopping Cart Application
A complete full-stack shopping cart application built with React, Node.js, and MongoDB. This project demonstrates a modern e-commerce workflow with product browsing, cart management, and checkout functionality.

Project Overview
This is a full-stack e-commerce cart application that provides a seamless shopping experience. Users can browse products, manage their shopping cart, and complete purchases with a mock checkout system.

Technology Stack
Frontend: React.js with modern hooks

Backend: Node.js with Express.js

Database: MongoDB for data persistence

API: RESTful architecture

Project Structure
text
Ecom_Cart/
 backend/          # Node.js/Express server
 frontend/         # React application
 README.md         # This file
Installation Guide
Prerequisites
Node.js installed on your system

MongoDB running locally or connection string

Git for version control

Step 1: Backend Setup
Navigate to the backend directory:

bash
cd backend
Install dependencies:

bash
npm install
Create environment file:
Create a .env file in the backend directory with:

text
MONGODB_URI=mongodb://localhost:27017/ecomcart
PORT=5000
Start the backend server:

bash
npm start
The backend will run on http://localhost:5000

Step 2: Frontend Setup
Open a new terminal and navigate to the frontend directory:

bash
cd frontend
Install dependencies:

bash
npm install
Start the React application:

bash
npm start
The frontend will open at http://localhost:3000

Features Implemented
Backend Features
RESTful API for product management

Cart operations (add, remove, update)

Checkout processing with receipt generation

MongoDB integration for data persistence

Error handling and validation

Frontend Features
Responsive product grid layout

Interactive shopping cart

Real-time quantity updates

Checkout form with validation

Order confirmation receipt

Mobile-friendly design

API Endpoints
GET /api/products - Fetch all products

POST /api/cart - Add item to cart

DELETE /api/cart/:id - Remove item from cart

GET /api/cart - Get cart contents with totals

POST /api/checkout - Process order and generate receipt

Usage Instructions
Browse Products: View the product grid on the main page

Add to Cart: Click "Add to Cart" on any product

Manage Cart: View cart to update quantities or remove items

Checkout: Fill out customer information and submit order

Receipt: View order confirmation with total and timestamp

Demo Video
A complete walkthrough of the application features is available in the demo video. The video covers:

Backend API functionality

Frontend user interface

Cart management operations

Checkout process

Responsive design demonstration

Development Notes
The application uses a mock product database

Cart data persists across sessions

No real payment processing involved

Focus on clean code and user experience

Future Enhancements
User authentication system

Product search and filtering

Order history tracking

Product categories

Image upload for products

Email confirmation for orders