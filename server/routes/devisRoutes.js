import express from "express";
import {
  ajouterDevis,
  getAllDevis,
  updateDevis,
  deleteDevis,
} from "../controllers/devisController.js";

const router = express.Router();

// ➕ Créer un devis
router.post("/", ajouterDevis);

// 📄 Lister tous les devis
router.get("/", getAllDevis);

// ✏️ Modifier un devis
router.put("/:id", updateDevis);

// ❌ Supprimer un devis
router.delete("/:id", deleteDevis);

export default router;
