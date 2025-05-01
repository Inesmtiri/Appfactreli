import Facture from "../models/facture.js";
import Produit from "../models/Produit.js"; // Gestion des stocks
import Paiement from "../models/Paiement.js";
import Depense from "../models/depense.js";
// ➕ Créer une facture
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
      montantPaye: data.montantPaye || 0,
      montantRestant: data.montantRestant || (data.total - (data.montantPaye || 0)),
      tvaRate: data.tvaRate,
      modePaiement: data.modePaiement,
      nomEntreprise: data.nomEntreprise,
      telephone: data.telephone,
      statut: data.statut || "non payé",
      envoyée: data.envoyée || false,
      logo: data.logo || "", // ✅ Logo ajouté ici
    });

    const saved = await nouvelleFacture.save();

    // 🛠 Mise à jour des stocks pour les produits
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
    console.error("❌ Erreur ajout facture :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la facture." });
  }
};

// 📄 Lister toutes les factures
export const getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.find().populate("client");
    res.json(factures);
  } catch (err) {
    console.error("❌ Erreur chargement factures :", err);
    res.status(500).json({ message: "Erreur chargement factures." });
  }
};

// ✏️ Modifier une facture
export const updateFacture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const factureExistante = await Facture.findById(id);

    // 🛠 Restaurer les stocks des anciennes lignes
    for (const ligne of factureExistante.lignes) {
      if (ligne.type === "produit") {
        const produit = await Produit.findById(ligne.itemId);
        if (produit) {
          produit.stockActuel += ligne.quantite;
          produit.statut = "en stock";
          await produit.save();
        }
      }
    }

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
        montantPaye: data.montantPaye || 0,
        montantRestant: data.montantRestant || (data.total - (data.montantPaye || 0)),
        tvaRate: data.tvaRate,
        modePaiement: data.modePaiement,
        nomEntreprise: data.nomEntreprise,
        telephone: data.telephone,
        statut: data.statut || "non payé",
        envoyée: data.envoyée || false,
        logo: data.logo || "",
      },
      { new: true }
    );

    // 🛠 Décrémenter les stocks avec les nouvelles lignes
    for (const ligne of lignesFormatées) {
      if (ligne.type === "produit") {
        const produit = await Produit.findById(ligne.itemId);
        if (produit) {
          produit.stockActuel = Math.max(0, produit.stockActuel - ligne.quantite);
          produit.statut = produit.stockActuel === 0 ? "rupture" : "en stock";
          await produit.save();
        }
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ Erreur modification facture :", error);
    res.status(500).json({ message: "Erreur lors de la modification de la facture." });
  }
};

// 🗑 Supprimer une facture
export const deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée." });
    }
    res.json({ message: "Facture supprimée." });
  } catch (error) {
    console.error("❌ Erreur suppression facture :", error);
    res.status(500).json({ message: "Erreur suppression facture." });
  }
};

// 📬 Marquer une facture comme envoyée
export const envoyerFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndUpdate(
      req.params.id,
      { envoyée: true },
      { new: true }
    );

    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée." });
    }

    res.json(facture);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la facture :", error);
    res.status(500).json({ message: "Erreur envoi facture." });
  }
};
export const getStatsFacturesParStatut = async (req, res) => {
  try {
    const factures = await Facture.find();
    const paiements = await Paiement.aggregate([
      {
        $group: {
          _id: "$facture",
          montantTotal: { $sum: "$montant" },
        },
      },
    ]);

    const paiementsMap = new Map();
    paiements.forEach((p) => {
      paiementsMap.set(p._id.toString(), p.montantTotal);
    });

    const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ];

    const statsParMois = {};

    factures.forEach((facture) => {
      const moisIndex = new Date(facture.date).getMonth();
      const mois = moisNoms[moisIndex];
      const total = facture.total;
      const montantPayé = paiementsMap.get(facture._id.toString()) || 0;

      let statut = "nonPayé";
      if (montantPayé >= total) statut = "payé";
      else if (montantPayé > 0) statut = "partiel";

      if (!statsParMois[mois]) {
        statsParMois[mois] = { mois, payé: 0, partiel: 0, nonPayé: 0 };
      }

      statsParMois[mois][statut]++;
    });

    const result = Object.values(statsParMois).sort(
      (a, b) => moisNoms.indexOf(a.mois) - moisNoms.indexOf(b.mois)
    );

    res.json(result);
  } catch (err) {
    console.error("❌ Erreur stats factures :", err);
    res.status(500).json({ message: "Erreur lors de l'agrégation" });
  }
};
// 📊 Agrégation des produits/services les plus rentables
export const getProduitsServicesRentables = async (req, res) => {
  try {
    const factures = await Facture.find({}, "lignes");

    const revenusMap = new Map();

    // Parcours de toutes les lignes de toutes les factures
    factures.forEach(facture => {
      facture.lignes.forEach(ligne => {
        const key = `${ligne.designation}-${ligne.type}`;
        const previous = revenusMap.get(key) || {
          designation: ligne.designation,
          type: ligne.type,
          quantite: 0,
          revenu: 0,
        };

        previous.quantite += ligne.quantite;
        previous.revenu += ligne.quantite * ligne.prixUnitaire;

        revenusMap.set(key, previous);
      });
    });

    const result = Array.from(revenusMap.values());

    res.json(result);
  } catch (error) {
    console.error("❌ Erreur agrégation rentabilité :", error);
    res.status(500).json({ message: "Erreur lors de l'agrégation des produits/services." });
  }
};
// ✅ Obtenir le total des factures
export const getTotalFactures = async (req, res) => {
  try {
    const total = await Facture.countDocuments();
    res.json({ total });
  } catch (err) {
    console.error("Erreur total factures :", err);
    res.status(500).json({ message: "Erreur lors du calcul du total des factures" });
  }
};
export const getTotalProfit = async (req, res) => {
  try {
    const [factureAgg, depenseAgg] = await Promise.all([
      Facture.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Depense.aggregate([
        { $group: { _id: null, total: { $sum: "$montant" } } },
      ]),
    ]);

    const totalFactures = factureAgg[0]?.total || 0;
    const totalDepenses = depenseAgg[0]?.total || 0;
    const profit = totalFactures - totalDepenses;

    res.json({ profit, totalFactures, totalDepenses });
  } catch (err) {
    console.error("❌ Erreur calcul profit :", err);
    res.status(500).json({ message: "Erreur lors du calcul du profit" });
  }
};