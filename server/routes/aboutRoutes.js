import express from "express";
import Entreprise from "../models/Entreprise.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const nouvelle = new Entreprise(req.body);
    await nouvelle.save();
    res.status(201).json({ message: "Enregistré" });
  } catch (err) {
    console.error("❌ Backend erreur :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
