import express from "express";
import Facture from "../models/facture.js"; // assure-toi que le modèle est bien nommé

const router = express.Router();

// 📥 GET : toutes les factures envoyées à un client donné
router.get("/:clientId", async (req, res) => {
  try {
    const factures = await Facture.find({
      client: req.params.clientId,
      envoyée: true, // n'affiche que les factures marquées comme "envoyées"
    })
      .sort({ createdAt: -1 }) // facultatif : les plus récentes en premier
      .populate("client");     // facultatif : pour avoir les infos client

    res.json(factures);
  } catch (error) {
    console.error("❌ Erreur récupération factures client :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
