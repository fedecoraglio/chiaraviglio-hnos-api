import * as connections from '../config/connection';

const INSERT_CURRENT_ACCOUNT_QUERY = `INSERT INTO current_account (cua_account_number, cua_fec_f, cua_tip_f, cua_fa1_f,
                                      cua_fac_f, cua_com_f, cua_vto_f, cua_imp_f, cua_deb_f, cua_cre_f, cua_sal_f, 
                                      cua_dif_change, cua_cot_usd, cua_ref_f, cua_ctl_f, cua_cli_c, cua_des_c, cua_rex_f,
                                      cua_fcc_f, cua_xxx_f, cua_cil_f, cua_register, cua_salfac_f, cua_condescu_f, cua_rub_f)
                                      VALUES ?`;
const SELECT_BY_ACCOUNT_NUMBER_QUERY = `SELECT cua.cua_id, cua.cua_account_number, cua.cua_fec_f, cua.cua_tip_f, cua.cua_fa1_f,
                                        cua.cua_fac_f, cua.cua_com_f, cua.cua_vto_f, cua.cua_imp_f,
                                        cua.cua_deb_f, cua.cua_cre_f, cua.cua_sal_f,
                                        cua.cua_dif_change, cua.cua_cot_usd, cua.cua_ref_f, cua_ctl_f,
                                        cua.cua_cli_c, cua.cua_des_c, cua.cua_rex_f,
                                        cua.cua_fcc_f, cua.cua_xxx_f, cua.cua_cil_f, cua.cua_register,
                                        cua.cua_salfac_f, cua.cua_condescu_f, cua.cua_rub_f
                                        FROM current_account cua WHERE cua.cua_account_number LIKE ?
                                        ORDER BY cua.cua_id DESC LIMIT ? OFFSET ?`;
const SELECT_BY_REPORT_NUMBER_QUERY = `SELECT cua.cua_id, cua.cua_account_number, cua.cua_fec_f, cua.cua_tip_f,
                                       cua.cua_fa1_f, cua.cua_fac_f, cua.cua_vto_f, cua.cua_deb_f, cua.cua_cre_f,
                                       cua.cua_sal_f, cua.cua_cot_usd, cua.cua_ref_f, cua.cua_rub_f
                                       FROM current_account cua WHERE cua.cua_account_number LIKE ?
                                       ORDER BY cua.cua_id DESC LIMIT ? OFFSET ?`;
const SELECT_BY_CREATED_DATE_QUERY = `SELECT cua.cua_id, cua.cua_account_number, cua.cua_fec_f, cua.cua_tip_f, cua.cua_fa1_f,
                                        cua.cua_fac_f, cua.cua_com_f, cua.cua_vto_f, cua.cua_imp_f,
                                        cua.cua_deb_f, cua.cua_cre_f, cua.cua_sal_f,
                                        cua.cua_dif_change, cua.cua_cot_usd, cua.cua_ref_f, cua_ctl_f,
                                        cua.cua_cli_c, cua.cua_des_c, cua.cua_rex_f,
                                        cua.cua_fcc_f, cua.cua_xxx_f, cua.cua_cil_f, cua.cua_register,
                                        cua.cua_salfac_f, cua.cua_condescu_f, cua.cua_rub_f
                                        FROM current_account cua
                                        WHERE cua.cua_account_number LIKE ? AND cua.cua_fec_f >= ? AND cua.cua_fec_f <= ?
                                        ORDER BY cua.cua_id DESC`;
const SELECT_BY_EXPIRATION_DATE_QUERY = `SELECT cua.cua_id, cua.cua_account_number, cua.cua_fec_f, cua.cua_tip_f, cua.cua_fa1_f,
                                        cua.cua_fac_f, cua.cua_com_f, cua.cua_vto_f, cua.cua_imp_f,
                                        cua.cua_deb_f, cua.cua_cre_f, cua.cua_sal_f,
                                        cua.cua_dif_change, cua.cua_cot_usd, cua.cua_ref_f, cua_ctl_f,
                                        cua.cua_cli_c, cua.cua_des_c, cua.cua_rex_f,
                                        cua.cua_fcc_f, cua.cua_xxx_f, cua.cua_cil_f, cua.cua_register,
                                        cua.cua_salfac_f, cua.cua_condescu_f, cua.cua_rub_f
                                        FROM current_account cua
                                        WHERE cua.cua_account_number LIKE ? AND cua.cua_vto_f >= ? AND cua.cua_vto_f <= ?
                                        ORDER BY cua.cua_id DESC`;
const SELECT_BY_ACCOUNT_NUMBER_COUNT_QUERY = `SELECT count(*) as total_row FROM current_account cua 
                                              WHERE cua.cua_account_number LIKE ?`;
const TRUNCATE_CURRENT_ACCOUNT_QUERY = 'TRUNCATE current_account';

export default class CurrentAccountModel {

  public getCurrentAcountByAccountNumberCount(accountNumber) {
    return connections.db.query(SELECT_BY_ACCOUNT_NUMBER_COUNT_QUERY, [accountNumber]);
  }

  public getCurrentAccountByCreatedDate(accountNumber, startDate, endDate) {
    return connections.db.query(SELECT_BY_CREATED_DATE_QUERY, [accountNumber, startDate, endDate]);
  }

  public getCurrentAccountByExpirationDate(accountNumber, startDate, endDate) {
    return connections.db.query(SELECT_BY_EXPIRATION_DATE_QUERY, [accountNumber, startDate, endDate]);
  }

  public getCurrentAccountByAccountNumber(accountNumber, limit, offset) {
    return connections.db.query(SELECT_BY_ACCOUNT_NUMBER_QUERY, [accountNumber, limit, offset])
  }

  public getCurrentAccountByAccountNumberReport(accountNumber, limit, offset) {
    return connections.db.query(SELECT_BY_REPORT_NUMBER_QUERY, [accountNumber, limit, offset])
  }

  public insertCurrentAccountBulk(currentAccount) {
    return connections.db.query(INSERT_CURRENT_ACCOUNT_QUERY, [currentAccount]);
  }

  public truncateCurrentAccountTable() {
    return connections.db.query(TRUNCATE_CURRENT_ACCOUNT_QUERY);
  }
}