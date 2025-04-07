import express from "express";
import {
  ajouterPaiement,
  getPaiements,
  updatePaiement,
  deletePaiement,
} from "../controllers/paiementController.js";

const router = express.Router();

router.post("/", ajouterPaiement);
router.get("/", getPaiements);
router.put("/:id", updatePaiement);
router.delete("/:id", deletePaiement);

export default router;
