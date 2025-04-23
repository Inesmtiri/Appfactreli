import express from "express";
import {
  getDevisByClient,
  getDevisDetails,
  acceptDevis,
  refuseDevis,
} from "../controllers/clientDevisController.js";

const router = express.Router();

// 🔍 Récupérer tous les devis reçus
router.get("/:clientId", getDevisByClient);

// 📄 Détail d’un devis
router.get("/details/:id", getDevisDetails);

// ✅ Accepter un devis
router.put("/:id/accept", acceptDevis);

// ❌ Refuser un devis
router.put("/:id/refuse", refuseDevis);

export default router;
