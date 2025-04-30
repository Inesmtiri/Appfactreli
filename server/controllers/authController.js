import User from '../models/User.js';
import Client from '../models/Client.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';

// 🔐 Connexion : Admin + Client
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Admin ?
    const admin = await User.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.password)) {
      return res.status(200).json({
        _id: admin._id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        role: 'admin',
      });
    }

    // 🔍 Client ?
    const client = await Client.findOne({ email });
    if (client && password === client.motDePasse) {
      return res.status(200).json({
        _id: client._id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: 'client',
      });
    }

    return res.status(401).json({ message: "Email ou mot de passe invalide." });

  } catch (err) {
    console.error("❌ Erreur connexion :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


// 📩 Mot de passe oublié (envoi code)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpire = Date.now() + 10 * 60 * 1000; // expire dans 10 min
    await user.save();

    await sendEmail(user.email, "Code de vérification", `Votre code est : ${code}`);
    res.json({ message: "Code envoyé par email." });

  } catch (err) {
    console.error("❌ Erreur forgotPassword :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔁 Réinitialisation du mot de passe avec le code
export const resetPassword = async (req, res) => {
  const { code } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetCode: code,
      resetCodeExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Code invalide ou expiré" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès." });

  } catch (err) {
    console.error("❌ Erreur resetPassword :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
