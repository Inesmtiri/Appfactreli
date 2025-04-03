import mongoose from "mongoose";

const entrepriseSchema = new mongoose.Schema({
  nomEntreprise: {
    type: String,
    required: true
  },
  activiteEntreprise: {
    type: String,
    required: true
  },
  descriptionEntreprise: {
    type: String,
    required: true
  },
  chiffreAffaireEstime: {
    type: String,
    required: true
  },
  emailEntreprise: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Entreprise", entrepriseSchema);
