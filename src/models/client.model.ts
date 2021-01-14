import * as connections from '../config/connection';

const INSERT_CLIENT_QUERY = "INSERT INTO clients (cli_name, cli_id_number, cli_account_number, cli_zone, cli_account_id) VALUES ?";
const TRUNCATE_CLIENT_QUERY = "TRUNCATE clients";
const SELECT_CLIENT_BY_QUERY = "SELECT cli.cli_id, cli.cli_account_number FROM clients cli WHERE cli.cli_id_number = ?"

export default class ClientModel {

  public insertClientsBulk(clients) {
    return connections.db.query(INSERT_CLIENT_QUERY, [clients]);
  }

  public selectClientByIdNumber(idNumber) {
    return connections.db.query(SELECT_CLIENT_BY_QUERY, [idNumber]);
  }

  public truncateClients() {
    return connections.db.query(TRUNCATE_CLIENT_QUERY);
  }
}