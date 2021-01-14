import TicketTypeModel from '../models/ticket-type.model';

/**
 * Erro codes (301-400)
 * 301: error getting all ticket types
 */
export default class TicketTypeService {
  
  public getAllTicketTypes(nextSucess, nextError) {
    new TicketTypeModel().getAllTicketTypes()
    .then((rows) => {
      const rowsResponse = [];
      if(rows && rows.length > 0)  {
        for(let ticketType of rows) {
          rowsResponse.push(this.transforDBDataToJsonResponse(ticketType));
        }
      }
      nextSucess(rowsResponse);
    })
    .catch((errorQuery) => {
      console.error(errorQuery);
      nextError({
        code: 301,
        error: errorQuery.sqlMessage
      });
    });
  }

  private transforDBDataToJsonResponse(ticketTypeRow) {
    return {
      id: ticketTypeRow.tit_id,
      code: ticketTypeRow.tit_code,
      description: ticketTypeRow.tit_description,
    }
  }
}
