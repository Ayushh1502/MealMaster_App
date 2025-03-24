# MealMaster App

MealMaster is a meal planning application that helps users create meal plans, track daily intake, and receive nutritional insights. The app provides secure authentication and personalized user profiles to enhance the user experience.

## Features

- **User Authentication**: Secure login and registration using email/password and social media (Google, Facebook) authentication.
- **Meal Planning**: Cr**User Profiles**: Store dietary preferences, allergies, and fitness goals.
- eate, update, and manage meal plans.
- **Nutritional Insights**: Track daily intake and receive health recommendations.
- **Secure Data Handling**: Passwords are encrypted using `bcrypt.js`, and user authentication is managed with `JWT`.

## Tech Stack

### Frontend:

- HTML
- CSS
- JavaScript

### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose)
- bcrypt.js (Password Encryption)
- JWT (Authentication)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Ayushh1502/MealMaster_App.git
   ```
2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```

## Folder Structure

```
meal-master/
│── backend/               # Backend Code
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Routes
│   ├── controllers/      # Business Logic
│   ├── middleware/       # Auth & Other Middleware
│   ├── config/           # Database & JWT Config
│   ├── index.js          # Main Server File
│── frontend/              # Frontend Code
│   ├── index.html        # Main HTML File
│   ├── styles.css        # Stylesheet
│   ├── app.js            # Main JavaScript File
│── README.md              # Project Documentation
│── package.json           # Backend Dependencies
```

## Deployment

- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Render.

## Environment Variables

Create a `.env` file in the `backend` directory and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

## Contact

For any queries, reach out at: [[your-email@example.com](mailto\:ayushrajput@example.com)]

