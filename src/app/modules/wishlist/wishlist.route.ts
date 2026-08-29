import { Router } from 'express';
import auth from '../../middlewares/auth';
import { WishlistController } from './wishlist.controller';

const router = Router();

router.post('/toggle', auth(), WishlistController.toggleWishlist);
router.post('/', auth(), WishlistController.addToWishlist);
router.delete('/:productId', auth(), WishlistController.removeFromWishlist);
router.get('/check/:productId', auth(), WishlistController.checkWishlistStatus);
router.get('/mine', auth(), WishlistController.getUserWishlist);
router.get('/product-ids', auth(), WishlistController.getUserWishlistedProductIds);

export const WishlistRoutes = router;
