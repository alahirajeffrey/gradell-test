import { User } from "./models";
import { RegisterAndLoginType } from "./types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// register user
export const registerUser = async (data: RegisterAndLoginType) => {
  try {
    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
      throw new Error("user already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email,
      passwordHash: passwordHash,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// login user
export const loginUser = async (data: RegisterAndLoginType) => {
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error("user does not exist");
    }

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      user.passwordHash
    );
    if (!isPasswordMatch) {
      throw new Error("invalid email or password");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );

    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
