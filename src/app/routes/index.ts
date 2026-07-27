import { Router } from 'express';

import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';

import { CategoryRoutes } from '../modules/category/category.route';
import { UploadRoutes } from '../modules/upload/upload.route';
import { CourierRoutes } from '../modules/courier/courier.route';
import { InquiryRoutes } from '../modules/inquiry/inquiry.route';
import { ProductRoutes } from '../modules/product/product.route';
import { ShippingZoneRoutes } from '../modules/shippingZone/shippingZone.route';
import { DealRoutes } from '../modules/deal/deal.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
  {
    path: '/couriers',
    route: CourierRoutes
  },
  {
    path: '/shipping-zones',
    route: ShippingZoneRoutes
  },
  {
    path: '/inquiries',
    route: InquiryRoutes
  },
  {
    path: '/categories',
    route: CategoryRoutes
  },
  {
    path: '/products',
    route: ProductRoutes
  },
  {
    path: '/deals',
    route: DealRoutes
  },
  {
    path: '/uploads',
    route: UploadRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
