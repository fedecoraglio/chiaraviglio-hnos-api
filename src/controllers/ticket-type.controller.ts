import * as express from 'express';
import TicketTypeService from '../services/ticket-type.service';

class TicketTypeController {

  public getTicketTypes(req, res: express.Response, next: express.NextFunction): void {
    new TicketTypeService().getAllTicketTypes(
      (ticketTypes) => {
        res.status(200).json(ticketTypes);
        next();
      },(error) => {
        res.status(401).json(error);
        next();
      }
    )
  }
}

export default new TicketTypeController();