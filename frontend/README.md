# CareerPilot Frontend

Welcome to the CareerPilot frontend application. This is a React application built with Vite that provides the user interface for students, mentors, and administrators.

## 🚀 How to Run the Project

Follow these steps to set up and run the frontend on your local machine:

1. **Clone the Repository**
   Clone the project from GitHub and navigate into the `frontend` directory:
   ```bash
   git clone <YOUR-GITHUB-REPO-URL>
   cd careerpilot/frontend
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed, then run the following in the `frontend` directory:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure you have configured your environment variables properly (e.g., in a `.env` file) to point to the backend server API.

3. **Start the Frontend Development Server**
   Start the Vite development server by running:
   ```bash
   npm run dev
   ```
   The application will be accessible at the local URL provided in your terminal (usually `http://localhost:5173`).

### ⚙️ Running the Backend

To ensure the app correctly connects to the API and Database, you also need to run the backend server. Open a new terminal instance and follow these steps:

1. **Navigate and Install**
   ```bash
   cd ../backend
   npm install
   ```
2. **Environment Setup**
   Ensure an `.env` file exists in the `backend` directory containing your `MONGO_URI`, `JWT_SECRET`, and port configurations.
3. **Start the Backend Server**
   ```bash
   npm start
   ```
   *(Or run `npm run dev` if using nodemon for development.)*

---

## 📖 User Guides & Flows

Here is an overview of the core workflows within the application:

### 1. Registration (Sign Up)
- Navigate to the **Sign Up** page (`/signup`).
- Choose whether you are registering as a **Student** or a **Mentor**.
- Fill out the required personal details (Name, Email, Phone, Password, Education status, etc.).
- Upon submission, an OTP (One-Time Password) will be sent to your registered email address.
- Enter the 6-digit OTP to successfully verify and activate your account.

### 2. Login
- Navigate to the **Login** page (`/login`).
- Select your role: **Student**, **Mentor**, or **Admin**.
- Provide your registered email and password.
- You will securely be routed to the appropriate dashboard (e.g., Admin Panel for administrators, or the generic Dashboard for students/mentors).

### 3. Payments & Purchases
- Once logged in, users can browse and purchase various premium features such as career assessments, skill courses, or booking 1-on-1 sessions.
- Selecting an item will prompt a payment or checkout module.
- Follow the on-screen instructions to securely complete the transaction. 
- Successful payments will unlock the content and be recorded in your profile's transaction/purchase history.

### 4. Password Recovery
- If you forget your password, click **Forgot Password?** on the Login screen.
- Enter your email to receive a secure recovery OTP.
- Enter the OTP and create a new password to regain access to your dashboard.
