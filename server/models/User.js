import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
