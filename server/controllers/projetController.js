import Projet from "../models/Projet.js";

// ➕ Ajouter un projet
export const createProjet = async (req, res) => {
  try {
    const newProjet = new Projet(req.body);
    await newProjet.save();
    res.status(201).json(newProjet);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du projet", error: err.message });
  }
};

// 🔁 Obtenir tous les projets
export const getAllProjets = async (req, res) => {
  try {
    const projets = await Projet.find();
    res.status(200).json(projets);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
};

// ✏️ Modifier un projet
export const updateProjet = async (req, res) => {
  try {
    const updated = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la modification", error: err.message });
  }
};

// 🗑 Supprimer un projet
export const deleteProjet = async (req, res) => {
  try {
    await Projet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
};
