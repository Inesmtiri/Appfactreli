import mongoose from 'mongoose';

const depenseSchema = new mongoose.Schema({
  categorie: { type: String, required: true },
  date: { type: Date, required: true },
  commercant: { type: String },
  description: { type: String },
  montant: { type: Number, required: true },
  image: { type: String }, // base64 ou lien
}, { timestamps: true });

const Depense = mongoose.model('Depense', depenseSchema);

export default Depense;
