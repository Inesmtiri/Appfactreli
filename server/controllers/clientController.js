import Client from "../models/Client.js";
import Devis from "../models/devis.js";
import Facture from "../models/facture.js";

// ➕ Créer un client
export const createClient = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Client existe déjà." });
    }

    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Erreur création", error: error.message });
  }
};

// 📄 Liste des clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Modifier un client
export const updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur modification", error: error.message });
  }
};

// 🗑️ Supprimer un client
export const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error: error.message });
  }
};

// 📊 ✅ KPI Clients actifs (basé sur activité réelle)
export const getKpiClients = async (req, res) => {
  try {
    const total = await Client.countDocuments();

    // Récupère tous les IDs de clients mentionnés dans devis et factures
    const devisClients = await Devis.distinct("clientId");
    const factureClients = await Facture.distinct("client");

    // Fusionne les deux tableaux dans un Set
    const allActifsIds = [...new Set([...devisClients, ...factureClients])];

    // Vérifie que les IDs existent bien dans la collection Client
    const actifs = await Client.countDocuments({ _id: { $in: allActifsIds } });

    res.json({
      total,
      actifs,
    });
  } catch (err) {
    console.error("❌ Erreur KPI clients actifs :", err);
    res.status(500).json({ message: "Erreur chargement KPI clients" });
  }
};