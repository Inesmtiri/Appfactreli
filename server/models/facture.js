// models/Facture.js
import mongoose from "mongoose";

const ligneSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "lignes.type", // Référence dynamique à "produit" ou "service"
  },
  type: {
    type: String,
    enum: ["produit", "service"],
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
  },
  prixUnitaire: {
    type: Number,
    required: true,
  },
});

const factureSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  date: String,
  numeroFacture: String,
  reference: String,
  lignes: [ligneSchema],
  subtotal: Number,
  tax: Number,
  total: Number,
  montantPaye: Number,
  montantRestant: Number,
  tvaRate: Number,
  modePaiement: String,
  nomEntreprise: String,
  telephone: String,
  statut: {
    type: String,
    enum: ["payé", "non payé"],
    default: "non payé",
  },
}, { timestamps: true });

const Facture = mongoose.model("Facture", factureSchema);
export default Facture;
