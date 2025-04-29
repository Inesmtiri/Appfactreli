import express from 'express';
import {
  creerDepense,
  getDepenses,
  modifierDepense,
  supprimerDepense
} from '../controllers/depenseController.js';

const router = express.Router();

router.post('/', creerDepense);
router.get('/', getDepenses);
router.put('/:id', modifierDepense);
router.delete('/:id', supprimerDepense);


export default router;
