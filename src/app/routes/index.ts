import { Router } from 'express';

import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';

import { CourierRoutes } from '../modules/courier/courier.route';
import { ShippingZoneRoutes } from '../modules/shippingZone/shippingZone.route';
import { InquiryRoutes } from '../modules/inquiry/inquiry.route';

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
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
