import express from "express";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/new", async (req, res) => {
  try {
    // Expecting: { email, products: [{ name, quantity }], orderValue }
    const { email, products, orderValue } = req.body;
    const result = await orderModel.create({ email, products, orderValue });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Get all orders for a user by email
orderRouter.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await orderModel.find({ email }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin or debug)
orderRouter.get("/all", async (req, res) => {
  try {
    const result = await orderModel.find();
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default orderRouter;