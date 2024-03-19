import express from 'express';
import { UserRouter } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrdersRouter } from '../modules/orders/orders.routes';
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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
