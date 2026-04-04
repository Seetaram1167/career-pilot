require("dotenv").config();
// Server starting...
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const adminRoutes = require("./routes/adminRoutes");

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const app = express();

    // Middleware
    app.use(cors()); // Allow frontend to communicate with backend
    app.use(express.json({ limit: "10mb" })); // Increase limit for large base64 images
    app.use(express.urlencoded({ limit: "10mb", extended: false }));

    // Routes
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/admin", adminRoutes);
    app.use("/api/career", require("./routes/careerRoutes"));
    app.use("/api/mentors", require("./routes/mentorRoutes"));
    app.use("/api/notifications", require("./routes/notificationRoutes"));
    app.use("/api/payment", require("./routes/paymentRoutes"));

    app.get("/", (req, res) => {
      res.status(200).json({ message: "Welcome to the CareerPilot API" });
    });

    // Error Handling Middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
