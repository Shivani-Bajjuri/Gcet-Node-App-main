import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } 
    }
  ],
  orderValue: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);