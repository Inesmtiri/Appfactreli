import mongoose from "mongoose";

const projetSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  budget: { type: Number, required: true },
  services: { type: String, required: true },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  totalHeures: { type: Number },
  client: { type: String },
  statut: { type: String, enum: ["en cours", "terminé"], default: "en cours" },
  equipe: [
    {
      id: Number,
      nom: String,
    },
  ],
});

export default mongoose.model("Projet", projetSchema);
