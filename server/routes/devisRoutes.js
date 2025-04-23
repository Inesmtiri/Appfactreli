import express from "express";
import {
  ajouterDevis,
  getAllDevis,
  updateDevis,
  deleteDevis,
  envoyerDevis, // 👈 ajouter cette fonction si besoin
  getDevisByClient // 👈 si tu veux lister les devis par client
} from "../controllers/devisController.js";

const router = express.Router();

// ➕ Créer un devis
router.post("/", ajouterDevis);

// 📄 Lister tous les devis
router.get("/", getAllDevis);

// 📄 Lister les devis par client (interface client)
router.get("/client/:clientId", getDevisByClient); // ex: /api/devis/client/123456

// ✏️ Modifier un devis
router.put("/:id", updateDevis);

// 📤 Marquer un devis comme envoyé
router.put("/:id/envoyer", envoyerDevis); // facultatif si tu veux séparer le bouton envoyer

// ❌ Supprimer un devis
router.delete("/:id", deleteDevis);

export default router;
