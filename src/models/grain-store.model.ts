import * as connections from '../config/connection';

const INSERT_BULK = `INSERT INTO grain_store (gst_account_number, gst_g_tipcp, gst_g_roman, gst_g_numcp,
                    gst_g_ctg, gst_g_fecha, gst_g_fecdesc, gst_g_fecarga, gst_g_cose, gst_g_codi, gst_g_nomchof,
                    gst_g_obser1, gst_g_bruto, gst_g_tara, gst_g_porzara, gst_g_zaran, gst_g_peso, gst_g_hume,
                    gst_g_porhum, gst_g_porvola, gst_g_mervola, gst_g_neto, gst_g_gardes, gst_g_certia,
                    gst_g_codgeo, gst_g_codloc, gst_g_provin, gst_g_contrat, gst_g_ctl, gst_g_locali,
                    gst_g_lote, gst_g_deslote, gst_g_patchas, gst_gr_tarflet, gst_g_tarflet, gst_g_kilometr,
                    gst_g_grado, gst_g_protein, gst_g_factor, gst_g_ctadesti, gst_g_nomdesti, gst_g_ctaplade,
                    gst_g_nomplade, gst_g_ctacorr, gst_g_nomcor,gst_g_ctatra, gst_g_nomtran)
                    VALUES ?`;

const SELECT_BY_ACCOUNT_NUMBER = `SELECT gst.gst_id, gst.gst_account_number, gst.gst_g_tipcp, gst.gst_g_roman, 
                    gst.gst_g_numcp, gst.gst_g_ctg, gst.gst_g_fecha, gst.gst_g_fecdesc, gst.gst_g_fecarga, gst.gst_g_cose, 
                    gst.gst_g_codi, gst.gst_g_nomchof, gst.gst_g_obser1, gst.gst_g_bruto, gst.gst_g_tara, 
                    gst.gst_g_porzara, gst.gst_g_zaran, gst.gst_g_peso, gst.gst_g_hume, gst.gst_g_porhum,
                    gst.gst_g_porvola, gst.gst_g_mervola, gst.gst_g_neto, gst.gst_g_gardes, gst.gst_g_certia,
                    gst.gst_g_codgeo, gst.gst_g_codloc, gst.gst_g_provin, gst.gst_g_contrat, gst.gst_g_ctl, 
                    gst.gst_g_locali, gst.gst_g_lote, gst.gst_g_deslote, gst.gst_g_patchas,
                    gst.gst_gr_tarflet, gst.gst_g_tarflet, gst.gst_g_kilometr, gst.gst_g_grado,
                    gst.gst_g_protein, gst.gst_g_factor, gst.gst_g_ctadesti, gst.gst_g_nomdesti, 
                    gst.gst_g_ctaplade,gst.gst_g_nomplade, gst.gst_g_ctacorr, gst.gst_g_nomcor, 
                    gst.gst_g_ctatra, gst.gst_g_nomtran
                    FROM grain_store gst
                    WHERE gst.gst_account_number LIKE ? 
                    ORDER BY gst.gst_id DESC LIMIT ? OFFSET ?`;
const SELECT_QUERY_FILTER = `SELECT gst.gst_id, gst.gst_account_number, gst.gst_g_tipcp, gst.gst_g_roman, 
                    gst.gst_g_numcp, gst.gst_g_ctg, gst.gst_g_fecha, gst.gst_g_fecdesc, gst.gst_g_fecarga, gst.gst_g_cose, 
                    gst.gst_g_codi, gst.gst_g_nomchof, gst.gst_g_obser1, gst.gst_g_bruto, gst.gst_g_tara, 
                    gst.gst_g_porzara, gst.gst_g_zaran, gst.gst_g_peso, gst.gst_g_hume, gst.gst_g_porhum,
                    gst.gst_g_porvola, gst.gst_g_mervola, gst.gst_g_neto, gst.gst_g_gardes, gst.gst_g_certia,
                    gst.gst_g_codgeo, gst.gst_g_codloc, gst.gst_g_provin, gst.gst_g_contrat, gst.gst_g_ctl, 
                    gst.gst_g_locali, gst.gst_g_lote, gst.gst_g_deslote, gst.gst_g_patchas,
                    gst.gst_gr_tarflet, gst.gst_g_tarflet, gst.gst_g_kilometr, gst.gst_g_grado,
                    gst.gst_g_protein, gst.gst_g_factor, gst.gst_g_ctadesti, gst.gst_g_nomdesti, 
                    gst.gst_g_ctaplade,gst.gst_g_nomplade, gst.gst_g_ctacorr, gst.gst_g_nomcor, 
                    gst.gst_g_ctatra, gst.gst_g_nomtran
                    FROM grain_store gst
                    WHERE gst.gst_account_number LIKE ? AND gst.gst_g_codi LIKE ? AND gst.gst_g_cose LIKE ?
                    ORDER BY gst.gst_id DESC`;                    

const SELECT_BY_ACCOUNT_NUMBER_COUNT_QUERY = `SELECT count(*) as total_row FROM grain_store gst 
                                              WHERE gst.gst_account_number LIKE ?`;
const TRUNCATE_QUERY = 'TRUNCATE grain_store';

export default class GrainStoreModel {
  
  public insertGrainStoreBulk(grainStore) {
    return connections.db.query(INSERT_BULK, [grainStore]);
  }

  public getGrainStoreByAccountNumber(accountNumber, limit, offset) {
    return connections.db.query(SELECT_BY_ACCOUNT_NUMBER, [accountNumber, limit, offset])
  }

  public getGrainStoreFilter(accountNumber, code, cose) {
    return connections.db.query(SELECT_QUERY_FILTER, [accountNumber, code, cose])
  }

  public getGrainStoreByAccountNumberCount(accountNumber) {
    return connections.db.query(SELECT_BY_ACCOUNT_NUMBER_COUNT_QUERY, [accountNumber]);
  }

  public truncateGrainStoreTable() {
    return connections.db.query(TRUNCATE_QUERY);
  }
}