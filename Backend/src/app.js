import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5500/docs" ,
  "https://prernamishra29.github.io/Illuminant/index.html"
  // Optional, include if you're serving from here
];

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Fallback route for undefined API endpoints
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
export { app };
