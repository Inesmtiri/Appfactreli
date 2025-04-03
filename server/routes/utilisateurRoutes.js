import express from 'express';
import {
  getUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
} from '../controllers/utilisateurController.js';

const router = express.Router();

router.get('/', getUtilisateurs);
router.post('/', createUtilisateur);
router.put('/:id', updateUtilisateur);
router.delete('/:id', deleteUtilisateur);

export default router;
