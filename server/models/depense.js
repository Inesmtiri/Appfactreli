import mongoose from 'mongoose';

const depenseSchema = new mongoose.Schema(
  {
    categorie: {
      type: String,
      required: true,
      trim: true,
    },
    montant: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    commercant: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // base64 ou URL d’un fichier
      default: "",
    },
  },
  { timestamps: true }
);

const Depense = mongoose.model('Depense', depenseSchema);

export default Depense;
