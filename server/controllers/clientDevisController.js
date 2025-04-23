import Devis from "../models/devis.js";

// 🔍 Afficher tous les devis d’un client
export const getDevisByClient = async (req, res) => {
  try {
    const devis = await Devis.find({ clientId: req.params.clientId });
    res.json(devis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des devis." });
  }
};

// 📄 Détails d’un devis
export const getDevisDetails = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    if (!devis) return res.status(404).json({ error: "Devis introuvable." });
    res.json(devis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du devis." });
  }
};

// ✅ Accepter un devis
export const acceptDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "accepté" },
      { new: true }
    );
    res.json(devis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l’acceptation du devis." });
  }
};

// ❌ Refuser un devis
export const refuseDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "refusé" },
      { new: true }
    );
    res.json(devis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du refus du devis." });
  }
};
