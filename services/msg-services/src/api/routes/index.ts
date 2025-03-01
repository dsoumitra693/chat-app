import { Router } from 'express';
import { getMessage, sendMessage } from '../controller';

const msgRouter = Router();

msgRouter.get('/message', getMessage);
msgRouter.post('/message', sendMessage);

export { msgRouter };
