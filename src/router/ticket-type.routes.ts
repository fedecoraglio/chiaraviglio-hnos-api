import TicketTypeController from '../controllers/ticket-type.controller';

import { Router } from 'express';

/**
 * @class TicketTypeRouter
 */
export default class TicketTypeRouter {
    public router: Router;

    constructor() {
      this.router = Router();
      this.routes();
    }

    public routes(): void {
      this.router.get('/', TicketTypeController.getTicketTypes);
  }
}