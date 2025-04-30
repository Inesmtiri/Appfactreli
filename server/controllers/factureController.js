import Facture from "../models/facture.js";
import Produit from "../models/Produit.js"; // 🆕 Import Produit pour gérer le stock

// Créer une facture
export const ajouterFacture = async (req, res) => {
  try {
    const data = req.body;

    const lignesFormatées = data.lignes.map(ligne => ({
      itemId: ligne.itemId,
      type: ligne.type,
      designation: ligne.designation,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
    }));

    const nouvelleFacture = new Facture({
      client: data.client,
      date: data.date,
      numeroFacture: data.numeroFacture,
      reference: data.reference,
      lignes: lignesFormatées,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      montantPaye: data.montantPaye,
      montantRestant: data.montantRestant,
      tvaRate: data.tvaRate,
      modePaiement: data.modePaiement,
      nomEntreprise: data.nomEntreprise,
      telephone: data.telephone,
      statut: data.statut || "non payé",
      envoyée: data.envoyée || false,
    });

    const saved = await nouvelleFacture.save();

    // 🛠 Décrémenter les stocks après création de facture
    for (const ligne of data.lignes) {
      if (ligne.type === "produit") {
        const produit = await Produit.findById(ligne.itemId);
        if (produit) {
          produit.stockActuel = Math.max(0, produit.stockActuel - ligne.quantite);
          produit.statut = produit.stockActuel === 0 ? "rupture" : "en stock";
          await produit.save();
        }
      }
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur ajout facture :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout." });
  }
};

// Lister toutes les factures
export const getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.find().populate("client");
    res.json(factures);
  } catch (err) {
    console.error("Erreur chargement factures :", err);
    res.status(500).json({ message: "Erreur chargement factures" });
  }
};

// Modifier une facture
export const updateFacture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const lignesFormatées = data.lignes.map(ligne => ({
      itemId: ligne.itemId,
      type: ligne.type,
      designation: ligne.designation,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
    }));

    const updated = await Facture.findByIdAndUpdate(
      id,
      {
        client: data.client,
        date: data.date,
        numeroFacture: data.numeroFacture,
        reference: data.reference,
        lignes: lignesFormatées,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        montantPaye: data.montantPaye,
        montantRestant: data.montantRestant,
        tvaRate: data.tvaRate,
        modePaiement: data.modePaiement,
        nomEntreprise: data.nomEntreprise,
        telephone: data.telephone,
        statut: data.statut || "non payé",
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Erreur modification facture :", error);
    res.status(500).json({ message: "Erreur modification." });
  }
};

// Supprimer une facture
export const deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }
    res.json({ message: "Facture supprimée." });
  } catch (error) {
    console.error("Erreur suppression facture :", error);
    res.status(500).json({ message: "Erreur suppression." });
  }
};

// Envoyer une facture (changer le statut à "envoyé")
export const envoyerFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndUpdate(
      req.params.id,
      { envoyée: true },
      { new: true }
    );

    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    res.json(facture);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la facture :", error);
    res.status(500).json({ message: "Erreur envoi facture" });
  }
};
