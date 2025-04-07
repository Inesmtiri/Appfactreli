// ✅ controllers/devisController.js
import Devis from '../models/devis.js';

// 📌 Ajouter un devis
export const addDevis = async (req, res) => {
  try {
    const nouveauDevis = new Devis(req.body);
    const saved = await nouveauDevis.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du devis", error });
  }
};

// 📌 Récupérer tous les devis
export const getDevis = async (req, res) => {
  try {
    const devis = await Devis.find();
    res.status(200).json(devis);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des devis", error });
  }
};

// 📌 Supprimer un devis
export const deleteDevis = async (req, res) => {
  try {
    const deleted = await Devis.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Devis non trouvé" });
    res.status(200).json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

// 📌 Modifier un devis
export const updateDevis = async (req, res) => {
  try {
    const updated = await Devis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Devis non trouvé" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification", error });
  }
};
