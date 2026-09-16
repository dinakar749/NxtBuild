import "dotenv/config";
import app from "../src/app.js";
import connectDB from "../src/config/db.config.js";

// Connect to database
connectDB();

export default app;
