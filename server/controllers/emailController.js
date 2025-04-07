import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Email from "../models/email.js";

dotenv.config();

export const sendFactureEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    // Transporteur Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Mot de passe d'application Gmail
      },
    });

    // Envoi du mail
    await transporter.sendMail({
      from: `"Facterli" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    // Sauvegarde dans la base
    const email = new Email({ to, subject, message });
    await email.save();

    res.status(200).json({ success: true, message: "✅ Email envoyé et enregistré avec succès" });
  } catch (error) {
    console.error("❌ Erreur envoi email:", error.message);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email", error: error.message });
  }
};
