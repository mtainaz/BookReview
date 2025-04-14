# Book Review Website with OAuth Authentication & Semantic Book Recommender

## Overview
This is an ongoing project for a Book Review Website where users can search, view, rate, and review books. The website also features a semantic book recommender. Users can log in or sign up securely via third-party authentication providers (e.g., Google) using OAuth and manage their sessions through cookies.

## Technologies
* **Frontend:** React
* **Backend:** Node.js, Express
* **Database:** PostgreSQL
* **Authentication:** OAuth (with cookies for session management), Username/Password authentication (bcrypt for password hashing)
* **Recommendation System:** Python, pandas, numpy, langchain

## Features
* **Search, View, Rate, and Review Books:** Users can browse through an extensive catalog of books, rate them, and write reviews.
* **OAuth Authentication:** Secure login and signup via third-party providers (e.g., Google) for an easy and seamless user experience.
* **Username/Password Authentication:** Users can also sign up and log in using a user ID and password. Passwords are securely hashed using bcrypt.
* **Collaborative Learning-Based Recommendation System:** Personalized book recommendations based on user preferences. 
* **RESTful API:** Built using Node.js/Express, providing a clean and efficient API for book data, user authentication, and reviews.
* **Scalable Database:** PostgreSQL used to store user data, book information, and reviews. The database is designed for scalability to accommodate growing data, users, and interactions.

## Run Backend
1. Navigate to the server directory:

   ```bash
   cd Server
* To install all packages type npm i
* do node index.js

## Run Frontend
* cd into Client/bookreview
* do npm start
