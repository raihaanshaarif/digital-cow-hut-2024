import express from 'express';
import { UserRouter } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrdersRouter } from '../modules/orders/orders.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AdminRoutes } from '../modules/admin/admin.route';
// import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/cow',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrdersRouter,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
