import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// interface CustomRequest extends Request {
//   user?: any;
// }

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, String(process.env.JWT_SECRET), (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    (req as any).user = user; // Explicitly type cast to any to bypass TS error here
    next();
  });
};

export default verifyToken;
