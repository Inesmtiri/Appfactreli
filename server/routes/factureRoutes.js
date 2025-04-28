import express from "express";
import Facture from "../models/facture.js"; // ✅ tu avais oublié cette ligne

import {
  ajouterFacture,
  getAllFactures,
  updateFacture,
  deleteFacture,
  envoyerFacture,
} from "../controllers/factureController.js";

const router = express.Router();

// Ajouter une facture
router.post("/", async (req, res) => {
  try {
    console.log("📥 Facture reçue :", req.body);
    const facture = new Facture(req.body);
    const saved = await facture.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Erreur enregistrement facture :", error.message);
    res.status(500).json({ message: "Erreur enregistrement facture" });
  }
});



// Récupérer toutes les factures
router.get("/", getAllFactures);

// Modifier une facture
router.put("/:id", updateFacture);

// Supprimer une facture
router.delete("/:id", deleteFacture);

// Envoyer une facture (changer le statut à "envoyé")
router.patch("/:id/envoyer", envoyerFacture);


export default router;
