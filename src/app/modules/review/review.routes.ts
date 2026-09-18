import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = Router();

router.get('/vendor', auth('VENDOR'), ReviewController.getVendorReviews);
router.patch('/:id/reply', auth('VENDOR'), ReviewController.replyToReview);
router.post('/', auth('BUYER', 'ADMIN', 'VENDOR'), ReviewController.createReview);

export const ReviewRoutes = router;
