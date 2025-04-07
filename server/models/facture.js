import mongoose from "mongoose";

const factureSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  numeroFacture: String,
  reference: String,
  date: Date,
  nomEntreprise: String,
  telephone: String,
  lignes: [
    {
      designation: String,
      quantite: Number,
      prixUnitaire: Number,
      itemId: String,
      type: String,
    },
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  montantPaye: Number,
  montantRestant: Number,
  tvaRate: Number,
  modePaiement: String,
  statut: { type: String, enum: ["payé", "non payé"], default: "non payé" },
}, { timestamps: true });

const Facture = mongoose.model("Facture", factureSchema);
export default Facture;
