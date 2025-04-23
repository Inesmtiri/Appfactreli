import express from 'express';
const router = express.Router();

import { login, forgotPassword, resetPassword } from '../controllers/authController.js';
import sendEmail from "../utils/sendEmail.js";

// 🔐 Routes auth
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:code', resetPassword);

// 🔍 Route de test
router.get('/test', (req, res) => {
  res.json({ message: "✅ Route auth fonctionne" });
});

export default router;
