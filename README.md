# NodeJS Web App - Women Techpower
## Overview
This project is a Node.js-based web application for managing events, job postings, mentorship programs, and user authentication. It features secure login and database integration to ensure scalable and efficient data handling.

## Features
### User Authentication & Security
- User login & registration system
- JWT-based authentication for secure API access
- Password hashing & session management
### Event & Job Management
- Create, update, delete, and view events and job listings
- Database-driven CRUD operations
### Mentorship Program
- Manage mentorship opportunities with structured data
- API routes for mentorship details and interactions
### RESTful API & Database Integration
- Express.js REST API for event, job, and user management
- Secure data validation and error handling
## Project Structure
- app.js → Main application file
- auth.js → Handles user authentication and JWT tokens
- db.js → Database connection using MySQL
- routes/ → API endpoints for different modules
- models/ → Mongoose schemas for structured data
- public/ → Static assets (CSS, JavaScript, images)
  
## Console commands used
**`node app.js`**
- runs the application
**`npm install express mysql2 ejs bcrypt passport passport-local express-session`**
- `npm install`: installs Node.js modules using npm (node package manager)
- `express`
  - a web application framework for Node.js
  - simplified handling HTTP requests, routing and rendering views
  - ex: handles routes like /register, /login, /dashboard
- `mysql2`
  - a library that allows the app to interact with the MySQL database
  - stores user data
  - contains promise support, which is used in this app (pending, fulfilled, rejected)
- `ejs` (Embedded JavaScript)
  - template engine for NodeJS
  - useful for rendering data from the server to the client
  - ex: renders pages like login.ejs with dynamic data
- `bcrypt`
  - library to hash passwords securely
- `passport`
  - handles authentication in Node.js applications
  - simplifies the login/logout process, by supporting various strategies
  - ex: authenticates users during login
- `passport-local`
  - strategy used by passport for authenticating users with a username and password
  - verifies user credentials by comparing input with stored data
  - ex: checks if the entered password matches the hashed password during login
- `express-session`
  - used to persist user sessions across multiple requests
  - maintains the user session after login
