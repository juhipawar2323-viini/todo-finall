# Full-Stack Todo Application

This is a production-ready Full-Stack Todo Application built using React.js for the frontend and Node.js/Express.js for the backend. It uses Supabase PostgreSQL for the database and features custom email/password authentication using bcrypt and JWT, combined with Supabase's Row Level Security (RLS) for data protection.

## Technologies Used

* **Frontend:** React.js, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** Supabase PostgreSQL
* **Authentication:** Custom JWT authentication with bcrypt for password hashing
* **Security:** Supabase Row Level Security (RLS), JWT tokens, strict CORS

## Architecture

The application follows the Model-View-Controller (MVC) architecture on the backend. The React frontend interacts solely with the REST API provided by the Node.js backend. The Node.js backend interacts with the Supabase database. The frontend never accesses the database directly.

```text
React Frontend  -->  REST API  -->  Node.js + Express  -->  Supabase PostgreSQL
```

## Folder Structure

```text
todo-fullstack/
│
├── frontend-todo/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── backend-todo/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

## Supabase Setup

The application uses Supabase PostgreSQL. The Node.js backend communicates with the database using the `@supabase/supabase-js` client and the Service Role Key.

### Database Schema

**users** table:
* `id`: UUID (Primary Key)
* `name`: TEXT
* `email`: TEXT (Unique)
* `password`: TEXT (Hashed via bcrypt)
* `created_at`: TIMESTAMP
* `updated_at`: TIMESTAMP

**todos** table:
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key to users.id)
* `title`: TEXT
* `description`: TEXT
* `completed`: BOOLEAN
* `created_at`: TIMESTAMP
* `updated_at`: TIMESTAMP

### Row Level Security (RLS) Policies

Row Level Security is enabled on both the `users` and `todos` tables.
The policies are designed so that users can only interact with their own data:

* **Users can view their own profile:** `id = auth.uid()`
* **Users can update their own profile:** `id = auth.uid()`
* **Users can view their own todos:** `user_id = auth.uid()`
* **Users can create their own todos:** `user_id = auth.uid()`
* **Users can update their own todos:** `user_id = auth.uid()`
* **Users can delete their own todos:** `user_id = auth.uid()`

*Note: Since the backend uses the service role key, it has elevated permissions to bypass RLS, but the backend explicitly checks the user ID using the authenticated JWT token before performing database actions to ensure data boundaries.*

## Environment Variables

You need to configure the environment variables for both the backend and frontend.

### Backend (`backend-todo/.env`)
Create a `.env` file from the `.env.example`:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URLS=http://localhost:3000,https://todos-app-pearl-beta.vercel.app
```

### Frontend (`frontend-todo/.env`)
Create a `.env` file from the `.env.example`:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Backend Installation

1. Navigate to the backend directory: `cd backend-todo`
2. Install dependencies: `npm install`
3. Configure the `.env` file.

## Frontend Installation

1. Navigate to the frontend directory: `cd frontend-todo`
2. Install dependencies: `npm install`
3. Configure the `.env` file.

## How to Run Locally

You need two terminals to run the application locally.

**Terminal 1 (Backend):**
```bash
cd backend-todo
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend-todo
npm start
```

The frontend will run at `http://localhost:3000` and the backend will run at `http://localhost:5000`.

## Render and Vercel deployment

On **Render**, set `FRONTEND_URLS` to the full Vercel site URL (for example, `https://todos-app-pearl-beta.vercel.app`) and redeploy the backend. Do not include a trailing slash.

On **Vercel**, set `REACT_APP_API_URL` to the Render backend origin (for example, `https://todos-app-8za0.onrender.com`) and redeploy the frontend. Do not append `/api`, because the frontend already includes `/api` in each request path.

## API Documentation

### Authentication
* `POST /api/auth/register`: Register a new user. Expects `{ name, email, password }`.
* `POST /api/auth/login`: Login user. Expects `{ email, password }`. Returns a JWT token.
* `GET /api/auth/me`: Get the current authenticated user. Requires `Authorization: Bearer <token>`.

### Todos
Requires `Authorization: Bearer <token>`.
* `POST /api/todos`: Create a new todo. Expects `{ title, description }`.
* `GET /api/todos`: Get all todos for the authenticated user.
* `GET /api/todos/:id`: Get a specific todo by ID.
* `PUT /api/todos/:id`: Update a todo. Expects `{ title, description, completed }`.
* `DELETE /api/todos/:id`: Delete a todo.

### Health Check
* `GET /api/health`: Check if the API is running.

## Authentication Flow

1. User registers or logs in via the React frontend.
2. The Node.js backend verifies the credentials (using bcrypt for passwords) and generates a JWT.
3. The JWT is returned to the frontend and stored in `localStorage`.
4. For all protected routes, the frontend attaches the JWT to the `Authorization` header as a Bearer token.
5. The backend `authMiddleware` verifies the JWT and attaches the user to the request object.

## Security Considerations

* **No Service Role exposed:** The Supabase Service Role Key is strictly confined to the backend and never exposed to the frontend.
* **Password Hashing:** Passwords are never stored in plain text. They are hashed using bcrypt before insertion into Supabase.
* **RLS Enabled:** Supabase RLS policies exist on tables to guarantee database-level isolation.
* **API Validation:** All endpoints validate user input before processing.

## Production Deployment Instructions

1. **Database:** Ensure Supabase RLS is enabled and the `service_role` key is strictly kept secret.
2. **Backend:** Deploy the Node.js/Express application to a platform like Render, Heroku, or DigitalOcean. Set the `NODE_ENV` to `production` and configure the production environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`). Ensure CORS is restricted to your actual frontend domain.
3. **Frontend:** Build the React app (`npm run build`) and deploy the static files to Vercel, Netlify, or AWS S3. Set the `REACT_APP_API_URL` to your production backend URL.
