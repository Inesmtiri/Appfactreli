import Depense from '../models/depense.js';

// ➕ Créer une dépense (avec image base64)
export const creerDepense = async (req, res) => {
  try {
    const {
      categorie,
      montant,
      date,
      description,
      commercant,
      image // 🔵 image encodée en base64
    } = req.body;

    const nouvelleDepense = new Depense({
      categorie,
      montant,
      date,
      description,
      commercant,
      image: image || "", // si image absente, stocker une chaîne vide
    });

    const saved = await nouvelleDepense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📄 Obtenir toutes les dépenses
export const getDepenses = async (req, res) => {
  try {
    const depenses = await Depense.find().sort({ createdAt: -1 });
    res.json(depenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Modifier une dépense
export const modifierDepense = async (req, res) => {
  try {
    const updated = await Depense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Supprimer une dépense
export const supprimerDepense = async (req, res) => {
  try {
    await Depense.findByIdAndDelete(req.params.id);
    res.json({ message: "Dépense supprimée." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
