import mongoose from 'mongoose';

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  poste: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

export default Utilisateur;
