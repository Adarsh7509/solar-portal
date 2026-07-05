import { Router } from 'express';
import {
  submitLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
} from '../controllers/query.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public route for lead submission
router.post('/queries', submitLead);

// Admin routes (protected)
router.get('/admin/queries', authMiddleware, getAllLeads);
router.get('/admin/queries/:id', authMiddleware, getLeadById);
router.patch('/admin/queries/:id', authMiddleware, updateLeadStatus);

export default router;
