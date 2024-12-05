import { Router } from 'express';
import { getMessage } from '../controller';

const msgRouter = Router();

msgRouter.get('/message', getMessage);

export { msgRouter };
