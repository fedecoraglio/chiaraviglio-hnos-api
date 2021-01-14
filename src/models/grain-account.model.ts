import * as connections from '../config/connection';

const INSERT_BULK = `INSERT INTO grain_account (gra_account_number, gra_g_cuit,
                     gra_cli_name, gra_g_code, gra_g_cose, gra_g_in, gra_g_out, gra_g_stock,
                     gra_g_grano, gra_g_domici, gra_g_city, gra_g_zip_code, gra_g_state)
                     VALUES ?`;
const SELECT_BY_ACCOUNT_NUMBER = `SELECT gra.gra_id, gra.gra_account_number, gra.gra_g_cuit, 
                                  gra.gra_cli_name, gra.gra_g_code, gra.gra_g_cose, gra.gra_g_in, 
                                  gra.gra_g_out, gra.gra_g_stock,gra.gra_g_grano, gra.gra_g_domici, 
                                  gra.gra_g_city, gra.gra_g_zip_code, gra.gra_g_state
                                  FROM grain_account gra
                                  WHERE gra.gra_account_number LIKE ? 
                                  ORDER BY gra.gra_id DESC LIMIT ? OFFSET ?`;
const SELECT_BY_QUERY = `SELECT gra.gra_id, gra.gra_account_number, gra.gra_g_cuit, 
                        gra.gra_cli_name, gra.gra_g_code, gra.gra_g_cose, gra.gra_g_in, 
                        gra.gra_g_out, gra.gra_g_stock,gra.gra_g_grano, gra.gra_g_domici, 
                        gra.gra_g_city, gra.gra_g_zip_code, gra.gra_g_state
                        FROM grain_account gra
                        WHERE gra.gra_account_number LIKE ? AND gra.gra_g_code LIKE ? AND gra.gra_g_cose LIKE ?
                        ORDER BY gra.gra_id DESC`;
const SELECT_BY_ACCOUNT_NUMBER_COUNT_QUERY = `SELECT count(*) as total_row FROM grain_account gra 
                                              WHERE gra.gra_account_number LIKE ?`;
const TRUNCATE_QUERY = 'TRUNCATE grain_account';
export default class GrainAccountModel {

  public insertGrainAccountBulk(grainAccount) {
    return connections.db.query(INSERT_BULK, [grainAccount]);
  }

  public getGrainAccountByAccountNumber(accountNumber, limit, offset) {
    return connections.db.query(SELECT_BY_ACCOUNT_NUMBER, [accountNumber, limit, offset])
  }

  public getGrainAccountFilter(accountNumber, code, cose) {
    return connections.db.query(SELECT_BY_QUERY, [accountNumber, code, cose])
  }

  public getGrainAcountByAccountNumberCount(accountNumber) {
    return connections.db.query(SELECT_BY_ACCOUNT_NUMBER_COUNT_QUERY, [accountNumber]);
  }

  public truncateGrainAccountTable() {
    return connections.db.query(TRUNCATE_QUERY);
  }

}