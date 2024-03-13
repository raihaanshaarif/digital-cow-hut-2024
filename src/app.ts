import express, { Application } from 'express';
const app: Application = express();

import cors from 'cors';
import router from './app/routes';

app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', router);

export default app;
