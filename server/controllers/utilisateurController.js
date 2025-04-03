import Utilisateur from '../models/Utilisateur.js';

// GET - Tous les utilisateurs
export const getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST - Ajouter un utilisateur
export const createUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, poste } = req.body;
    const newUser = new Utilisateur({ nom, prenom, email, poste });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - Modifier un utilisateur
export const updateUtilisateur = async (req, res) => {
  try {
    const updated = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE - Supprimer un utilisateur
export const deleteUtilisateur = async (req, res) => {
  try {
    await Utilisateur.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
