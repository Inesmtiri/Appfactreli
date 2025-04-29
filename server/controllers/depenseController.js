// controllers/depense.controller.js
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
      fichierRecu, // 🔵 image encodée en base64
    } = req.body;

    const nouvelleDepense = new Depense({
      categorie,
      montant,
      date,
      description,
      commercant,
      image: fichierRecu || "", // Si aucune image n'est envoyée
    });

    const savedDepense = await nouvelleDepense.save();
    res.status(201).json(savedDepense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📄 Obtenir toutes les dépenses
export const getDepenses = async (req, res) => {
  try {
    const depenses = await Depense.find().sort({ createdAt: -1 }); // 🔵 Plus récent d'abord
    res.status(200).json(depenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Modifier une dépense
export const modifierDepense = async (req, res) => {
  try {
    const { fichierRecu, ...otherFields } = req.body;

    const updatedFields = { ...otherFields };
    if (fichierRecu !== undefined) {
      updatedFields.image = fichierRecu;
    }

    const updatedDepense = await Depense.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true } // retourne le document modifié
    );

    if (!updatedDepense) {
      return res.status(404).json({ message: "Dépense non trouvée." });
    }

    res.status(200).json(updatedDepense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Supprimer une dépense
export const supprimerDepense = async (req, res) => {
  try {
    const deletedDepense = await Depense.findByIdAndDelete(req.params.id);

    if (!deletedDepense) {
      return res.status(404).json({ message: "Dépense non trouvée." });
    }

    res.status(200).json({ message: "Dépense supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

