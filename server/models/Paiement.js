import mongoose from "mongoose";

const paiementSchema = new mongoose.Schema({
  numeroFacture: { type: String, required: true },
  datePaiement: { type: Date },
  typePaiement: { type: String },
  montant: { type: Number, required: true },
  statut: { type: Boolean, default: true },
});

export default mongoose.model("Paiement", paiementSchema);
