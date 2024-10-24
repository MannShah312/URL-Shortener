# URL Shortener

A simple and efficient URL Shortener application that allows users to create short links, manage their URLs, and view analytics on link usage.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- 
## Features

- **User Authentication**: Secure login and registration for users.
- **URL Shortening**: Convert long URLs into short, shareable links.
- **Link Management**: View, edit, and delete previously shortened links.
- **Analytics Dashboard**: View statistics on link clicks and usage.
- **Responsive Design**: User-friendly interface that works on both desktop and mobile devices.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Recharts**: A composable charting library for React.

### Backend

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing URL and user data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JSON Web Tokens (JWT)**: For secure user authentication.
- **bcrypt**: For hashing user passwords.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/url-shortener.git
    cd url-shortener
    ```

2. **Navigate to the backend directory and install dependencies**:
    ```bash
    cd backend
    npm install
    ```

3. **Set up the database**:
   Make sure MongoDB is running and create a `.env` file with the following variables:
    ```
    MONGODB_URI=<your_mongo_db_connection_string>
    JWT_SECRET=<your_jwt_secret>
    PORT=4000
    ```

4. **Run the backend server**:
    ```bash
    node index.js
    ```

5. **Navigate to the frontend directory and install dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

6. **Run the frontend application**:
    ```bash
    npm start
    ```

## Usage

- Visit `http://localhost:3000` in your web browser.
- Register or log in to your account.
- Use the provided input fields to shorten a URL.
- Access your shortened URLs and analytics through the dashboard.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in an existing user.

### URL Management

- `POST /api/url/shorten` - Shorten a new URL.
- `GET /api/url/myurls` - Get all URLs for the authenticated user.
- `DELETE /api/url/:id` - Delete a specific shortened URL.

### Analytics

- `GET /api/url/:id/stats` - Get analytics for a specific URL.
