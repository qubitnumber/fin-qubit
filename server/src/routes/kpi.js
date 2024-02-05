import express from "express";
import KPI from "../models/KPI.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import { deserializeUser } from '../middlewares/deserializeUser.js';
import { requireUser } from '../middlewares/requireUser.js';

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/kpis", async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;