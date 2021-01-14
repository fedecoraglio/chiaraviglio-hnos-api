import * as express from 'express';
import UserRouter from './user.routes';
import AuthRouter from './auth.routes';
import { IServer } from '../interfaces/server.interface';
import TicketTypeRouter from './ticket-type.routes';

export default class Routes {
    /**
     * @param  {IServer} server
     * @returns void
     */
    static init(server: IServer): void {
        const router: express.Router = express.Router();

        server.app.use('/', router);
        //auth
        server.app.use('/auth', new AuthRouter().router);
        // users  
        server.app.use('/v1/users', new UserRouter().router);
        //ticket type
        server.app.use('/v1/tickets/types', new TicketTypeRouter().router)
    }
}
