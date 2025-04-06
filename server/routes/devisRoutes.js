import express from 'express';
import {
  addDevis,      // ✅ corriger ici
  getDevis,
  updateDevis,
  deleteDevis
} from '../controllers/devisController.js';

const router = express.Router();

router.post('/', addDevis);          // ✅ corriger ici
router.get('/', getDevis);
router.put('/:id', updateDevis);
router.delete('/:id', deleteDevis);

export default router;
