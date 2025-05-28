import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import Authrouter from "./Routes/auth.route.js"
import session from "express-session";

dotenv.config();

const app = express();


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 200000, httpOnly: true }
}))

// json parser middleware added
app.use(express.json());

app.use("/api/auth", Authrouter);


(async () => {
  try {
    const PORT = process.env.PORT || 3000;
    const MONGODB_URL = process.env.MONGODB_URL;

    await mongoose.connect(MONGODB_URL);
    console.log(" Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to set up database:", error.message);
    process.exit(1);
  }
})();
