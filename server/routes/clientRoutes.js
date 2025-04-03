import express from 'express';
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getClients);              // 🔄 Lister
router.post('/', createClient);          // ➕ Créer
router.put('/:id', updateClient);        // ✏️ Modifier
router.delete('/:id', deleteClient);     // 🗑️ Supprimer

export default router;
