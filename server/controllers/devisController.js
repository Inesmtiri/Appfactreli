import Devis from "../models/devis.js";

// ✅ Ajouter un devis
export const ajouterDevis = async (req, res) => {
  try {
    const data = req.body;

    const lignesFormatées = data.lignes.map(ligne => ({
      itemId: ligne.itemId,
      type: ligne.type,
      designation: ligne.designation,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
    }));

    const nouveauDevis = new Devis({
      clientId: data.clientId,
      client: data.client,
      nomEntreprise: data.nomEntreprise,
      telephone: data.telephone,
      date: data.date,
      numeroDevis: data.numeroDevis,
      reference: data.reference,
      lignes: lignesFormatées,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      statut: "en attente",

    });

    const saved = await nouveauDevis.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur lors de l'ajout du devis :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du devis" });
  }
};

// ✅ Obtenir tous les devis
export const getAllDevis = async (req, res) => {
  try {
    const devis = await Devis.find();
    res.json(devis);
  } catch (error) {
    console.error("Erreur backend getAllDevis :", error);
    res.status(500).json({ message: "Erreur lors du chargement des devis" });
  }
};

// ✅ Modifier un devis
export const updateDevis = async (req, res) => {
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

    const updated = await Devis.findByIdAndUpdate(
      id,
      {
        clientId: data.clientId,
        client: data.client,
        nomEntreprise: data.nomEntreprise,
        telephone: data.telephone,
        date: data.date,
        numeroDevis: data.numeroDevis,
        reference: data.reference,
        lignes: lignesFormatées,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        statut: "en attente",
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la modification du devis :", error);
    res.status(500).json({ message: "Erreur modification devis" });
  }
};

// ✅ Supprimer un devis
export const deleteDevis = async (req, res) => {
  try {
    await Devis.findByIdAndDelete(req.params.id);
    res.json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression devis" });
  }
};

// ✅ Envoyer un devis (changer statut en "envoyé")
export const envoyerDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "envoyé" },
      { new: true }
    );
    res.json(devis);
  } catch (error) {
    console.error("Erreur lors de l'envoi du devis :", error);
    res.status(500).json({ message: "Erreur envoi devis" });
  }
};

// ✅ Accepter un devis (changer statut en "accepté")
export const acceptDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "accepté" },
      { new: true }
    );
    res.json(devis);
  } catch (error) {
    console.error("Erreur lors de l'acceptation du devis :", error);
    res.status(500).json({ message: "Erreur acceptation devis" });
  }
};

// ✅ Refuser un devis (changer statut en "refusé")
export const refuseDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "refusé" },
      { new: true }
    );
    res.json(devis);
  } catch (error) {
    console.error("Erreur lors du refus du devis :", error);
    res.status(500).json({ message: "Erreur refus devis" });
  }
};

// ✅ Lister les devis d'un client (interface client)
export const getDevisByClient = async (req, res) => {
  try {
    const devis = await Devis.find({ clientId: req.params.clientId });
    res.json(devis);
  } catch (error) {
    console.error("Erreur chargement devis client :", error);
    res.status(500).json({ message: "Erreur chargement devis client" });
  }
};
