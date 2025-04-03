import express from "express";
import {
  createProjet,
  getAllProjets,
  updateProjet,
  deleteProjet
} from "../controllers/projetController.js";

const router = express.Router();

router.post("/", createProjet);
router.get("/", getAllProjets);
router.put("/:id", updateProjet);
router.delete("/:id", deleteProjet);

export default router;
