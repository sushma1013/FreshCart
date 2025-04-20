🥦 Fresh Cart/Fruit Ordering System :

A full-stack web application that allows buyers to place bulk vegetable/fruit orders and track their status, while admins can manage inventory and order statuses efficiently.
This project focuses on a clean UI/UX, robust backend, and an optimized database.

✨ Features :

📦 View available vegetables/fruits catalogue.
🛒 Place bulk orders with buyer information.
🚚 Track order status using Order ID.
🔐 Admin dashboard for managing products and orders.
🛠 Add, edit, or delete products.
📈 Update order statuses: Pending → In Progress → Delivered.
📱 Fully responsive design with Tailwind CSS.
🔥 Deployed on Vercel.


📦 Project Setup Instructions
1. Clone the repository

git clone https://github.com/yourusername/bulk-ordering-app.git
cd bulk-ordering-app


2. Environment Variables
Create a .env.local file in the root:

DATABASE_URL=your_postgresql_database_url
PORT=5000
Note: Never commit your .env files to GitHub.


3. Install Frontend & Backend Dependencies
cd frontend
npm install

cd backend
npm install


4. Run the Application Locally

npm run dev 
    - for both frontend and backend terminals


🛠 Tech Stack:

Frontend
React.js
TypeScript
Tailwind CSS
Axios

Backend
Node.js

Express.js
API Routes (RESTful)


Database
PostgreSQL (Neon.tech)
pg (PostgreSQL Client)

Deployment
Vercel (Frontend + Backend)




Database Setup Instructions : 
You can use Neon.tech (free PostgreSQL hosting) or Docker.

Database Schema
Run these SQL commands to set up your tables:

 Final Database Tables Based on My Interfaces

🛍️ Products Table

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🧑‍💻 Users Table

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL
);


📦 Orders Table

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,         -- Customer's name
  address TEXT NOT NULL,              -- Customer's address
  phone VARCHAR(20) NOT NULL,          -- Customer's phone
  email VARCHAR(255) NOT NULL,         -- Customer's email
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



Method | Route | Description
GET | /api/products | Fetch product catalogue (Public)
POST | /api/products | Add a new product (Admin)
PUT | /api/products/:id | Edit an existing product (Admin)
DELETE | /api/products/:id | Delete a product (Admin)
POST | /api/orders | Place a new order (Public)
GET | /api/orders/:id | View order details by Order ID (Buyer)
GET | /api/orders | View all orders (Admin)
PUT | /api/orders/:id | Update order status (Admin)
POST | /api/auth/signin | User login (Buyer)
POST | /api/auth/admin/signin | Admin login (Admin)