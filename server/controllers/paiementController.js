import Paiement from "../models/Paiement.js";
import Facture from "../models/facture.js";

// 🔁 Fonction pour mettre à jour la facture liée après un paiement

const mettreAJourFacture = async (factureId) => {
  const paiements = await Paiement.find({ facture: factureId });
  const totalPaye = paiements.reduce((s, p) => s + p.montant, 0);

  const facture = await Facture.findById(factureId);
  if (!facture) return;

  const restant = facture.total - totalPaye;
  let statut = "non payé";
  if (totalPaye >= facture.total) {
    statut = "payé";
  } else if (totalPaye > 0) {
    statut = "partiellement payé";
  }

  await Facture.findByIdAndUpdate(factureId, {
    montantPaye: totalPaye,
    montantRestant: restant < 0 ? 0 : restant,
    statut,
  });
};

// ➕ Ajouter un paiement
export const ajouterPaiement = async (req, res) => {
  try {
    const nouveau = new Paiement(req.body);
    await nouveau.save();

    await mettreAJourFacture(nouveau.facture);

    res.status(201).json(nouveau);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Modifier un paiement
export const updatePaiement = async (req, res) => {
  try {
    const updated = await Paiement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updated) {
      await mettreAJourFacture(updated.facture);
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Supprimer un paiement
export const deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndDelete(req.params.id);
    if (paiement) {
      await mettreAJourFacture(paiement.facture);
    }
    res.json({ message: "Paiement supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Récupérer les paiements (avec info facture liée)
export const getPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find().populate("facture");
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
