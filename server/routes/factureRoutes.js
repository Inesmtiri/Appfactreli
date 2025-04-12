// routes/factureRoutes.js
import express from "express";
import {
  ajouterFacture,
  getAllFactures,
  updateFacture,
  deleteFacture,
} from "../controllers/factureController.js";

const router = express.Router();

// Ajouter une facture
router.post("/", ajouterFacture);

// Récupérer toutes les factures
router.get("/", getAllFactures);

// Modifier une facture
router.put("/:id", updateFacture);

// Supprimer une facture
router.delete("/:id", deleteFacture);

export default router;
