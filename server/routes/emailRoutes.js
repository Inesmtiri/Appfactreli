import express from "express";
import { sendFactureEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-facture", sendFactureEmail);

export default router;
