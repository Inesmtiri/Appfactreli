import express from 'express';
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
  getKpiClients 
} from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getClients);              // 🔄 Lister
router.post('/', createClient);          // ➕ Créer
router.put('/:id', updateClient);        // ✏️ Modifier
router.delete('/:id', deleteClient);     // 🗑️ Supprimer
router.get("/kpi", getKpiClients);
export default router;
