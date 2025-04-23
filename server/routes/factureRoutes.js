import express from "express";
import {
  ajouterFacture,
  getAllFactures,
  updateFacture,
  deleteFacture,
  envoyerFacture,
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

// Envoyer une facture (changer le statut à "envoyé")
router.patch("/:id/envoyer", envoyerFacture);


export default router;
