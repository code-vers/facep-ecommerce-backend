import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { InquiryValidation } from './inquiry.validation';
import { InquiryController } from './inquiry.controller';
import { Role } from '@prisma/client';

const router = Router();

// Public route to submit inquiry
router.post(
  '/',
  validateRequest(InquiryValidation.createInquirySchema),
  InquiryController.createInquiry
);

// Admin routes
router.get('/', auth(Role.ADMIN), InquiryController.getAllInquiries);
router.get('/:id', auth(Role.ADMIN), InquiryController.getSingleInquiry);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(InquiryValidation.updateInquirySchema),
  InquiryController.updateInquiry
);

router.delete('/:id', auth(Role.ADMIN), InquiryController.deleteInquiry);

export const InquiryRoutes = router;
