import express from 'express'
import productModel from "../models/productModel.js";

const productRouter = express.Router()

productRouter.get("/all", async (req, res) => {
  const products = await productModel.find();
  res.json(products);
});

productRouter.post("/new", async (req, res) => {
  const { img, name, price } = req.body;
  const product = { img, name, price };
  const products = await productModel.create(product);
  res.json(products);
});

export default productRouter