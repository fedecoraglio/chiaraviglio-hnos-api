import * as connections from '../config/connection';

const TICKET_TYPES_SELECT_QUERY = `SELECT tit.tit_id, tit.tit_code, tit.tit_description, tit.tit_action FROM ticket_types tit`;

export default class TicketTypeModel {

  public getAllTicketTypes() {
    return connections.db.query(TICKET_TYPES_SELECT_QUERY);
  }
}