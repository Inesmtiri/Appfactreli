import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: String,
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  resetCode: String,                 // 👈 code à 6 chiffres
  resetCodeExpire: Date             // 👈 durée de validité
}, { timestamps: true });

export default mongoose.model("User", userSchema);
