import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import projetRoutes from './routes/projetRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';

dotenv.config();

const app = express();

// 🔐 Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use('/api/users', userRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/utilisateur', utilisateurRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌ MONGODB_URL n'est pas défini !");
  process.exit(1);
}

// ⚙️ Connexion MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("✅ Connexion MongoDB réussie !");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend actif sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB :", error.message);
    process.exit(1);
  });

// 🌐 Route test
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API Facterli !");
});
