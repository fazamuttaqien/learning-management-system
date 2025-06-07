# 🚀 Professional Learning Management System (LMS)

## 🎯 Project Overview
Development of a full-stack Learning Management System (LMS) platform that is modern, intuitive, and feature-rich. This project is designed to facilitate the creation, distribution, and management of online learning content, as well as enable interaction between instructors and learners. The system also integrates a payment gateway for paid courses and a cloud-based media storage service for images and videos.

---

## ✨ Key Features
*   **User & Role Management:**
    *   👤 User registration and login (Student, Instructor, Admin).
    *   🔐 Secure authentication using JSON Web Tokens (JWT).
    *   🔑 Role and permission management.
*   **Course Management:**
    *   📚 Course creation, updating, and deletion by instructors.
    *   📖 Modular course structure (modules, lessons, quizzes).
    *   📤 Upload course materials (videos, documents, links).
*   **Learning & Interaction:**
    *   💻 Course access and student progress tracking.
    *   📝 Quiz and assessment features.
    *   💬 (Optional) Per-course discussion forums.
*   **Monetization:**
    *   💳 PayPal integration for paid course enrollment.
    *   🛒 Secure and easy checkout process.
*   **Media Management:**
    *   🖼️ Upload and manage course images and videos using Cloudinary.
    *   ⚡ Optimized media delivery.
*   **User Interface:**
    *   📱 Responsive design for various devices.
    *   🎨 Clean, modern, and user-friendly interface.

---

## 🛠️ Tech Stack

### ⚙️ Server-side (Backend)
*   **Directory:** `backend/`
*   **Runtime Environment:** 🟩 Node.js
    *   _Description:_ An event-driven, non-blocking I/O server-side JavaScript platform, ideal for real-time and scalable applications.
*   **Framework:** Express.js
    *   _Description:_ A minimalist and flexible web framework for Node.js, used to build RESTful APIs.
*   **Database:** 🍃 MongoDB
    *   _Description:_ A document-based NoSQL database offering scalability and schema flexibility. Used with Mongoose ODM for application data modeling.
*   **Payment Gateway:** 💳 PayPal
    *   _Description:_ Integration with PayPal API to securely process course payments.
*   **Media Storage:** ☁️ Cloudinary
    *   _Description:_ A cloud-based media management solution for storing, optimizing, and delivering images and videos.
*   **Authentication:** 🔑 JSON Web Tokens (JWT)
    *   _Description:_ An open standard for creating secure access tokens between parties.
*   **Others:**
    *   `bcrypt.js`: For password hashing.
    *   `dotenv`: For environment variable management.
    *   `multer` (with `multer-storage-cloudinary`): For handling file uploads to Cloudinary.

### 🖥️ Client-side (Frontend)
*   **Directory:** `frontend/`
*   **UI Library:** ⚛️ React
    *   _Description:_ A declarative and efficient JavaScript library for building interactive user interfaces based on components.
*   **Build Tool & Development Server:** ⚡ Vite
    *   _Description:_ A next-generation frontend tooling that provides an extremely fast Hot Module Replacement (HMR) and optimized builds.
*   **Programming Language:** 📜 JavaScript (ES6+)
    *   _Description:_ The primary language for client-side logic.
*   **State Management:** Context API / Redux Toolkit (choose one or specify if both were used)
    *   _Description:_ For efficiently managing complex application state.
*   **Routing:** React Router DOM
    *   _Description:_ For client-side navigation in a Single Page Application (SPA).
*   **HTTP Requests:** Axios / Fetch API
    *   _Description:_ For interacting with the backend API.
*   **Styling:** CSS Modules / Tailwind CSS / Styled Components (choose as applicable)
    *   _Description:_ For styling React components in an organized and maintainable way.

---

## 🚀 Project Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fazamuttaqien/learning-management-system
    cd learning-management-system
    ```
    *You will typically need two terminal windows/tabs open: one for the backend and one for the frontend.*

### ⚙️ Backend Setup
1.  **Navigate to the backend directory:**
    (From the `learning-management-system` root directory)
    ```bash
    cd backend
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    # or if using yarn
    # yarn install
    ```
3.  **Set Up Backend Environment Variables:**
    *   Create a `.env` file in the `backend` directory (`learning-management-system/backend/.env`).
    *   Copy the content below into your `.env` file and fill in the values with your credentials and configurations.
    *   **IMPORTANT:** Never share your `.env` file or commit it to a public repository. Ensure `backend/.env` is listed in your `.gitignore` file (or `*.env` if `.gitignore` is in the root).

    ```env
    PORT=5000

    JWT_SECRET=YOUR_STRONG_JWT_SECRET_HERE

    MONGO_URI=mongodb://localhost:27017/your_lms_database_name
    # Or your MongoDB Atlas connection URI

    CLIENT_URL=http://localhost:5173
    # Change to your frontend URL if different (e.g., in production)

    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

    PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
    PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
    # PAYPAL_MODE=sandbox # or 'live' for production
    ```
    *   **Notes:**
        *   `JWT_SECRET`: Should be a long, strong, random string.
        *   `MONGO_URI`: Adjust to your local MongoDB connection string or your Atlas URI.
        *   `CLIENT_URL`: The URL where your frontend application is running. For React Vite, the default is `http://localhost:5173`.
        *   `CLOUDINARY_*`: Obtain these from your Cloudinary dashboard.
        *   `PAYPAL_*`: Obtain these from your PayPal developer dashboard. `PAYPAL_MODE` is typically `sandbox` for development and `live` for production.

4.  **Run the backend development server:**
    (Make sure you are in the `learning-management-system/backend` directory)
    ```bash
    npm run dev
    # or your custom start script (e.g., npm start)
    ```
    The backend server should now be running at `http://localhost:5000` (or the port you specified in `backend/.env`).

### 🖥️ Frontend Setup
1.  **Navigate to the frontend directory:**
    (From the `learning-management-system` root directory)
    ```bash
    cd frontend
    ```
    *(If you were in the `backend` directory, you might use `cd ../frontend`)*
2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or if using yarn
    # yarn install
    ```
3.  **(Optional) Set Up Frontend Environment Variables:**
    *   If your frontend requires environment variables (e.g., the backend API URL if not proxied), create a `.env` file in the `frontend` directory (`learning-management-system/frontend/.env`).
    *   Example for Vite (variables must be prefixed with `VITE_`):
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
4.  **Run the frontend development server:**
    (Make sure you are in the `learning-management-system/frontend` directory)
    ```bash
    npm run dev
    # or if using yarn
    # yarn dev
    ```
    The frontend application should now be running at `http://localhost:5173` (Vite's default port).

---

## 🔗 Links
*   **Live Demo:** `[Link to Live Demo]`
*   **Code Repository:** `https://github.com/fazamuttaqien/learning-management-system` (Contains both frontend and backend in respective directories)

---

## 💡 Learnings & Challenges
*   **Key Challenges:**
    *   Securely integrating the PayPal payment system and handling callbacks.
    *   Designing an efficient MongoDB schema for relationships between courses, modules, lessons, and users.
    *   Managing global state in a complex React application.
    *   Organizing a monorepo structure and managing dependencies for both backend and frontend.
*   **Solutions & Learnings:**
    *   Implementation of webhooks and robust server-side logic for PayPal transaction verification.
    *   Proper use of embedding and referencing in MongoDB to optimize queries.
    *   Application of Redux Toolkit (or Context API with reducers) for structured state management.
    *   In-depth understanding of JWT authentication flow and middleware in Express.js.
    *   Optimizing Vite build for production.
    *   Clear separation of concerns between frontend and backend within the monorepo.

---

_This note summarizes the main technical aspects of the LMS project. Further details regarding specific architecture, user flows, or particular features can be discussed further._
