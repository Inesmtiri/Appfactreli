import Facture from "../models/facture.js";

export const createFacture = async (req, res) => {
  try {
    const facture = new Facture(req.body);
    await facture.save();
    res.status(201).json(facture);
  } catch (err) {
    res.status(500).json({ message: "Erreur création facture", error: err.message });
  }
};

export const getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.find().populate("client", "nom prenom societe");
    res.json(factures);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération factures", error: err.message });
  }
};

export const getFactureById = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id).populate("client", "nom prenom societe");
    if (!facture) return res.status(404).json({ message: "Facture non trouvée" });
    res.json(facture);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération facture", error: err.message });
  }
};

export const updateFacture = async (req, res) => {
  try {
    const updated = await Facture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Facture non trouvée" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour", error: err.message });
  }
};

export const deleteFacture = async (req, res) => {
  try {
    const deleted = await Facture.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Facture non trouvée" });
    res.json({ message: "Facture supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", error: err.message });
  }
};
