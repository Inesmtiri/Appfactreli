import Client from "../models/Client.js";

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
