import mongoose from 'mongoose';

const ligneSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantite: { type: Number, required: true },
  prixUnitaire: { type: Number, required: true }
}, { _id: false });

const devisSchema = new mongoose.Schema({
  clientType: {
    type: String,
    enum: ['interne', 'externe'],
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: function () { return this.clientType === 'interne'; }
  },
  client: { type: String }, // nom du client externe ou interne
  nomEntreprise: { type: String },
  telephone: { type: String },
  date: { type: Date, required: true },
  numeroDevis: { type: String, required: true },
  reference: { type: String },
  lignes: [ligneSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Devis', devisSchema);
