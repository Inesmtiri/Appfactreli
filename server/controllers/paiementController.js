import Paiement from "../models/Paiement.js";

export const ajouterPaiement = async (req, res) => {
  try {
    const nouveau = new Paiement(req.body);
    await nouveau.save();
    res.status(201).json(nouveau);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find();
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePaiement = async (req, res) => {
  try {
    const updated = await Paiement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePaiement = async (req, res) => {
  try {
    await Paiement.findByIdAndDelete(req.params.id);
    res.json({ message: "Paiement supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
