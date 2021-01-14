import UserService from './user.service';
import GrainStoreModel from '../models/grain-store.model';

/**
 * Error codes (401-500):
 * 401: User is not allowed to perform this action.
 * 402: Error getting count grain store query.
 * 403: Error getting user by id.
 */
export default class GrainStoreService {

  public getGrainStoreDestails(idAuth, idUser, limit = 50, offset = 1, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 401,
        error: "User is not allowed to perform this action"
      });
    } else {
      const grainStoreModel = new GrainStoreModel();
      new UserService().getUserById(idAuth, (userData) => {
        grainStoreModel.getGrainStoreByAccountNumberCount(userData.accountNumber)
        .then((rowsCount) => {
          if(rowsCount && rowsCount.length > 0)  {
            const totalRow = rowsCount[0].total_row;
            grainStoreModel.getGrainStoreByAccountNumber(userData.accountNumber, limit, offset)
            .then((rows) => {
              nextSucess(this.createDataResponse(rows, totalRow, limit, offset));
            }).catch((errorQuery) => {
              nextError({
                code: 402,
                error: errorQuery.sqlMessage
              });
            });
          }
        })
        .catch((errorQuery) => {
          console.error(errorQuery);
          nextError({
            code: 402,
            error: errorQuery.sqlMessage
          });
        })
      }, (error) => {
        console.error(error);
        nextError({
          code: 403,
          error: error
        });
      });
    }
  }

  public getGrainStoreDestailsFilter(idAuth, idUser, filterData, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 401,
        error: "User is not allowed to perform this action"
      });
    } else {
      const grainStoreModel = new GrainStoreModel();
      new UserService().getUserById(idAuth, (userData) => {
        if(filterData) {
          const searchByCode = filterData.searchByCode ? filterData.searchByCode.toUpperCase().trim() : '%%';
          const searchByCose = filterData.searchByCose ? filterData.searchByCose.toUpperCase().trim() : '%%';
          grainStoreModel.getGrainStoreFilter(userData.accountNumber, searchByCode, searchByCose)
          .then((rows) => {
            nextSucess(this.createDataResponse(rows, 0, 0, 0));
          }).catch((errorQuery) => {
            console.error(errorQuery);
            nextError({
              code: 402,
              error: errorQuery.sqlMessage
            });
          });
        }
      }, (error) => {
        nextError({
          code: 403,
          error: error
        });
      });
    }
  }

  public getAllGrainStoreDestails(idAuth, idUser, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 401,
        error: "User is not allowed to perform this action"
      });
    } else {
      const grainStoreModel = new GrainStoreModel();
      new UserService().getUserById(idAuth, (userData) => {
        grainStoreModel.getGrainStoreByAccountNumberCount(userData.accountNumber)
        .then((rowsCount) => {
          if(rowsCount && rowsCount.length > 0)  {
            const totalRow = rowsCount[0].total_row;
            grainStoreModel.getGrainStoreByAccountNumber(userData.accountNumber, totalRow, 0)
            .then((rows) => {
              nextSucess(this.createDataResponse(rows, totalRow, totalRow, 0));
            }).catch((errorQuery) => {
              nextError({
                code: 402,
                error: errorQuery.sqlMessage
              });
            });
          }
        })
        .catch((errorQuery) => {
          console.error(errorQuery);
          nextError({
            code: 402,
            error: errorQuery.sqlMessage
          });
        })
      }, (error) => {
        console.error(error);
        nextError({
          code: 403,
          error: error
        });
      });
    }
  }

  public getGrainStoreExcelColumns() {
    return [{
      caption: 'Cuenta',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Fecha',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Descarga',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Carga',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Tipo',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Cosecha',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Peso',
      type: 'number',
      width: 10,
    },
    {
      caption: 'Chofer',
      type: 'string',
      width: 40,
    },
    {
      caption: 'Destino',
      type: 'string',
      width: 40,
    },
    {
      caption: 'Contrato',
      type: 'string',
      width: 10,
    },
    {
      caption: 'Kms',
      type: 'number',
      width: 10,
    }];
  }

  private createDataResponse(rows, totalRow, limit, offset) {
    const rowsAccountNumber = [];
    if(rows && rows.length > 0) {
      for(let accountData of rows) {
        rowsAccountNumber.push(this.transforDBDataToJsonResponse(accountData));
      }
    }
    const response = {
      limit: limit,
      offset: offset,
      total: totalRow,
      items: rowsAccountNumber
    }
    return response;
  }

  private transforDBDataToJsonResponse(grainStoreData) {
    return {
      id: grainStoreData.gst_id,
      accountNumber: grainStoreData.gst_account_number,
      tipcp: grainStoreData.gst_g_tipcp,
      roman: grainStoreData.gst_g_roman,
      numcp: grainStoreData.gst_g_numcp,
      ctg: grainStoreData.gst_g_ctg,
      date: grainStoreData.gst_g_fecha,
      dateDesc: grainStoreData.gst_g_fecdesc,
      dateCarga: grainStoreData.gst_g_fecarga,
      cose: grainStoreData.gst_g_cose,
      code: grainStoreData.gst_g_codi,
      nomchof: grainStoreData.gst_g_nomchof,
      obser: grainStoreData.gst_g_obser1,
      bruto: grainStoreData.gst_g_bruto,
      tara: grainStoreData.gst_g_tara,
      porzara: grainStoreData.gst_g_porzara,
      zaran: grainStoreData.gst_g_zaran,
      peso: grainStoreData.gst_g_peso,
      hume: grainStoreData.gst_g_hume,
      porHum: grainStoreData.gst_g_porhum,
      porvola: grainStoreData.gst_g_porvola,
      mervola: grainStoreData.gst_g_mervola,
      neto: grainStoreData.gst_g_neto,
      gardes: grainStoreData.gst_g_gardes,
      certia: grainStoreData.gst_g_certia,
      codgeo: grainStoreData.gst_g_codgeo,
      codloc: grainStoreData.gst_g_codloc,
      provin: grainStoreData.gst_g_provin,
      contrat: grainStoreData.gst_g_contrat,
      ctl: grainStoreData.gst_g_ctl,
      city: grainStoreData.gst_g_locali,
      lote: grainStoreData.gst_g_lote,
      desLote: grainStoreData.gst_g_deslote,
      patchas: grainStoreData.gst_g_patchas,
      grTarflet: grainStoreData.gst_gr_tarflet,
      gTarflet: grainStoreData.gst_g_tarflet,
      km: grainStoreData.gst_g_kilometr,
      grade: grainStoreData.gst_g_grado,
      protein: grainStoreData.gst_g_protein,
      factor: grainStoreData.gst_g_factor,
      ctadesti: grainStoreData.gst_g_ctadesti,
      nomdesti: grainStoreData.gst_g_nomdesti,
      ctaplade: grainStoreData.gst_g_ctaplade,
      nomplade: grainStoreData.gst_g_nomplade,
      ctacorr: grainStoreData.gst_g_ctacorr,
      ctatra: grainStoreData.gst_g_ctatra,
      nomtran: grainStoreData.gst_g_nomtran,
    };    
  }
}