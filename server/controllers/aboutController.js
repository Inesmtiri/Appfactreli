import User from '../models/User.js';
import Entreprise from '../models/Entreprise.js';

export const getAboutData = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId).select('-password');
    const entreprise = await Entreprise.findOne();

    if (!user || !entreprise) {
      return res.status(404).json({ message: "Données non trouvées" });
    }

    res.status(200).json({ user, entreprise });
  } catch (err) {
    console.error("❌ Erreur dans /api/about :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
