import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders",orderRouter)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server Started on port 8080");
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
 return res.send("Good Morning");
});

app.get("/greet", (req,res) => {res.send("Greetings!")});

app.get("/name", (req,res) => {res.send("Jaya Prakash")});

app.get("/weather", (req,res) => {res.send("31°C")});