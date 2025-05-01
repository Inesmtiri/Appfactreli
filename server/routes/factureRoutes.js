import express from "express";
import Facture from "../models/facture.js"; // ✅ Modèle de facture

import {
  ajouterFacture,
  getAllFactures,
  updateFacture,
  deleteFacture,
  envoyerFacture,
  getStatsFacturesParStatut,        // ✅ Histogramme empilé
  getProduitsServicesRentables ,// ✅ Diagramme à bulles (nouveau)
  getTotalFactures ,
  getTotalProfit     
} from "../controllers/factureController.js";

const router = express.Router();

// ➕ Ajouter une facture
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

// 📄 Récupérer toutes les factures
router.get("/", getAllFactures);

// ✏️ Modifier une facture
router.put("/:id", updateFacture);

// ❌ Supprimer une facture
router.delete("/:id", deleteFacture);

// 📤 Envoyer une facture (changer le statut à "envoyé")
router.patch("/:id/envoyer", envoyerFacture);

// 📊 Statistiques mensuelles par statut (histogramme empilé)
router.get("/statut-mensuel", getStatsFacturesParStatut);

// 📈 Produits/services les plus rentables (diagramme à bulles)
router.get("/produits-rentables", getProduitsServicesRentables);
router.get("/total", getTotalFactures);
router.get("/profit", getTotalProfit);
export default router;
