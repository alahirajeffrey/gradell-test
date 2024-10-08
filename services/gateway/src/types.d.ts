import { Request } from "express";

interface CustomRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
