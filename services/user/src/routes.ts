import express, { Request, Response } from "express";
import verifyToken from "./decodeToken";
import { User } from "./models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const router = express.Router();
import { CustomRequest } from "./types";
import { sendMessageWithResponse } from "./sendMessageWithResponse";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// register
router.post("/register", async (req: Request, res: Response) => {
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
    res.status(500).json({ message: "server error", error });
  }
});

// login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

// create product
router.post(
  "/product",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const { name, price, description, quantity } = req.body;

    try {
      const payload = {
        action: "create",
        data: {
          name: name,
          price: Number(price),
          description: description,
          quantity: Number(quantity),
          sellerId: req.user?.userId,
        },
      };

      const response: any = await sendMessageWithResponse(
        payload,
        "product_queue"
      );

      if (response.success) {
        res
          .status(201)
          .json({ message: "product created", data: response.data });
      } else {
        res.status(400).json({
          message: "product creation failed",
          error: response.message,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "server error", error });
    }
  }
);

router.get("/product/:productId", async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const payload = {
      action: "getSingle",
      data: {
        productId: productId,
      },
    };
    const response: any = await sendMessageWithResponse(
      payload,
      "product_queue"
    );

    if (response.success) {
      res.status(200).json({ data: response.data });
    } else {
      res.status(500).json({
        message: "error occured",
        error: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

router.get("/product", async (req: Request, res: Response) => {
  try {
    const payload = {
      action: "getAll",
    };
    const response: any = await sendMessageWithResponse(
      payload,
      "product_queue"
    );

    if (response.success) {
      res.status(200).json({ data: response.data });
    } else {
      res.status(500).json({
        message: "error occured",
        error: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

export default router;
