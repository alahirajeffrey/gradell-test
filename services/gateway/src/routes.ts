import express, { Request, Response } from "express";
const router = express.Router();
import verifyToken from "./decodeToken";
import { CustomRequest } from "./types";
import { sendMessageWithResponse } from "./sendMessageWithResponse";

// register
router.post("/register", async (req: Request, res: Response) => {
  const { password, email } = req.body;

  try {
    const payload = {
      action: "register",
      data: {
        email: email,
        password: password,
      },
    };

    const response: any = await sendMessageWithResponse(payload, "user_queue");

    if (response && response.success) {
      res.status(201).json({ message: "user registered", data: response.data });
    } else if (response && !response.success) {
      res.status(500).json({
        error: response?.message || "user registration failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error", error });
  }
});

// login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const payload = {
      action: "login",
      data: {
        email: email,
        password: password,
      },
    };

    const response: any = await sendMessageWithResponse(payload, "user_queue");

    if (response && response.success) {
      res.status(201).json({ message: "user logged in", data: response.data });
    } else if (response && !response.success) {
      res.status(500).json({
        error: response?.message || "user login failed",
      });
    }
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

      if (response && response.success) {
        res
          .status(201)
          .json({ message: "product created", data: response.data });
      } else if (response && !response.success) {
        res.status(400).json({
          message: "product creation failed",
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

    if (response && response.success) {
      res.status(200).json({ data: response.data });
    } else if (response && !response.success) {
      res.status(500).json({
        message: "error occured",
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

    if (response && response.success) {
      res.status(200).json({ data: response.data });
    } else if (response && !response.success) {
      res.status(500).json({
        message: "error occured",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

// create order
router.post(
  "/order",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const { totalCost, products, deliveryAddress, quantity } = req.body;

    try {
      const payload = {
        action: "create",
        data: {
          totalCost: totalCost,
          deliveryAddress: deliveryAddress,
          products: products,
        },
      };

      const response: any = await sendMessageWithResponse(
        payload,
        "order_queue"
      );

      if (response && response.success) {
        res.status(201).json({ message: "order created", data: response.data });
      } else if (response && !response.success) {
        res.status(500).json({
          message: "order creation failed",
          error: response.message,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "server error", error });
    }
  }
);

// create order
router.get(
  "/order/:orderId",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const orderId = req.params.orderId;

    try {
      const payload = {
        action: "getSingleOrder",
        data: {
          orderId: orderId,
        },
      };

      const response: any = await sendMessageWithResponse(
        payload,
        "order_queue"
      );

      if (response && response.success) {
        res.status(201).json({ data: response.data });
      } else if (response && !response.success) {
        res.status(500).json({
          error: response?.message || "internal server error",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "server error", error });
    }
  }
);

// create order
router.post(
  "/payment",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const { orderId, amount } = req.body;

    try {
      const payload = {
        action: "create",
        data: {
          orderId: orderId,
          amount: amount,
        },
      };

      const response: any = await sendMessageWithResponse(
        payload,
        "payment_queue"
      );

      if (response && response.success) {
        res
          .status(201)
          .json({ message: "payment successful", data: response.data });
      } else if (response && !response.success) {
        res.status(500).json({
          message: "payment failed",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "server error", error });
    }
  }
);

export default router;
