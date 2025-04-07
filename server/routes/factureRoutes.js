import express from "express";
import {
  createFacture,
  getAllFactures,
  getFactureById,
  updateFacture,
  deleteFacture,
} from "../controllers/factureController.js";

const router = express.Router();

router.post("/", createFacture);
router.get("/", getAllFactures);
router.get("/:id", getFactureById);
router.put("/:id", updateFacture);
router.delete("/:id", deleteFacture);

export default router;
