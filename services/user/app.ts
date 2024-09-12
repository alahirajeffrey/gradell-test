import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "./models";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

// setup dotenv
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/user-db";

// setup express app
const app = express();
app.use(express.json());

// connect to mongodb
mongoose.connect(MONGO_URI).then(() => console.log("connected to mongodb"));

// route to register user
app.post("/users/register", async (req: Request, res: Response) => {
  const { password, email } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "user already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email,
      passwordHash: passwordHash,
    });

    res
      .status(201)
      .json({ message: "user registered successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// route to log in user
app.post("/users/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1y",
    });
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// listen for connections
app.listen(PORT, () => {
  console.log(`user service running on port ${PORT}`);
});
