import CurrentAccountModel from '../models/current-account.model';
import UserService from '../services/user.service';

/**
 * Erro codes (100-200):
 * 100: get current account data base error message
 * 101: User not found,
 * 102: get curent account count query data base error message.
 * 103: User is not allowed to perform this action
 */
export default class CurrentAccountService {

  public getCurrentAccountDestails(idAuth, idUser, limit = 50, offset = 1, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 103,
        error: "User is not allowed to perform this action"
      });
    } else {
      const currentAccountModel = new CurrentAccountModel();
      new UserService().getUserById(idAuth, (userData) => {
        currentAccountModel.getCurrentAcountByAccountNumberCount(userData.accountNumber)
        .then((rowsCount) => {
          if(rowsCount && rowsCount.length > 0)  {
            const totalRow = rowsCount[0].total_row;
            currentAccountModel.getCurrentAccountByAccountNumber(userData.accountNumber, limit, offset)
            .then((rows) => {
              nextSucess(this.createCurrentAccountDataResponse(rows, totalRow, limit, offset));
            }).catch((errorQuery) => {
              console.error(errorQuery);
              nextError({
                code: 100,
                error: errorQuery.sqlMessage
              });
            });
          }
        })
        .catch((errorQuery) => {
          console.error(errorQuery);
          nextError({
            code: 102,
            error: errorQuery.sqlMessage
          });
        })
      }, (error) => {
        console.error(error);
        nextError({
          code: 101,
          error: error
        });
      });
    }
  }

  public getAllCurrentAccountByAccountNumber(idAuth, nextSucess, nextError) {
    const currentAccountModel = new CurrentAccountModel();
    new UserService().getUserById(idAuth, (userData) => {
      currentAccountModel.getCurrentAcountByAccountNumberCount(userData.accountNumber)
      .then((rowsCount) => {
        let totalRow = 0
        if(rowsCount && rowsCount.length > 0)  {
          totalRow = rowsCount[0].total_row;
          currentAccountModel.getCurrentAccountByAccountNumberReport(userData.accountNumber, totalRow, 0)
          .then((rows) => {
            nextSucess(this.createCurrentAccountDataReport(rows, totalRow, totalRow, 0));
          }).catch((errorQuery) => {
            console.error(errorQuery);
            nextError({
              code: 100,
              error: errorQuery.sqlMessage
            });
          });
        } else {
          nextSucess({
            limit: totalRow,
            offset: 0,
            total: totalRow,
            items: []
          });
        }
      })
      .catch((errorQuery) => {
        console.error(errorQuery);
        nextError({
          code: 102,
          error: errorQuery.sqlMessage
        });
      })
    }, (error) => {
      console.error(error);
      nextError({
        code: 101,
        error: error
      });
    });
  }

  public getCurrentAccountDestailsFilter(idAuth, idUser, filterData, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 103,
        error: "User is not allowed to perform this action"
      });
    } else {
      const currentAccountModel = new CurrentAccountModel();
      new UserService().getUserById(idAuth, (userData) => {
        if(filterData.createdStartDate) {
          const createdStartDate = filterData.createdStartDate;          
          let createdEndDate = createdStartDate;
          if(filterData.createdEndDate) {
            createdEndDate = filterData.createdEndDate;
          }
          currentAccountModel.getCurrentAccountByCreatedDate(userData.accountNumber, createdStartDate, createdEndDate)
          .then((rows) => {
            nextSucess(this.createCurrentAccountDataResponse(rows, 0, 0, 0));
          }).catch((errorQuery) => {
            console.error(errorQuery);
            nextError({
              code: 100,
              error: errorQuery.sqlMessage
            });
          });
        } else if(filterData.expirationStartDate) {
          const expirationStartDate = filterData.expirationStartDate;          
          let expirationEndDate = expirationStartDate;
          if(filterData.expirationEndDate) {
            expirationEndDate = filterData.expirationEndDate;
          }
          currentAccountModel.getCurrentAccountByExpirationDate(userData.accountNumber, expirationStartDate, expirationEndDate)
          .then((rows) => {
            nextSucess(this.createCurrentAccountDataResponse(rows, 0, 0, 0));
          }).catch((errorQuery) => {
            console.error(errorQuery);
            nextError({
              code: 100,
              error: errorQuery.sqlMessage
            });
          });
        }
      }, (error) => {
        nextError({
          code: 101,
          error: error
        });
      });
    }
  }

  public getCurrentAccountExcelColumns() {
    return [{
      caption: 'Id',
      type: 'number',
      width: 10,
    },{
      caption: 'Cuenta',
      type: 'string',
      width: 10,
    },{
      caption: 'Emisión',
      type: 'string',
      width: 10,
    },{
      caption: 'T. Comprobante',
      type: 'string',
      width: 10,
    },{
      caption: 'Nro Comprobante',
      type: 'string',
      width: 10,
    },{
      caption: 'Vencimiento',
      type: 'string',
      width: 10,
    },{
      caption: 'Debito',
      type: 'number',
      width: 10,
    },{
      caption: 'Credito',
      type: 'number',
      width: 10,
    },{
      caption: 'Cotizacion Dolar',
      type: 'number',
      width: 10,
    },{
      caption: 'Referencia',
      type: 'string',
      width: 50,
    }];
  }

  private createCurrentAccountDataResponse(rows, totalRow, limit, offset) {
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

  private createCurrentAccountDataReport(rows, totalRow, limit, offset) {
    const rowsAccountNumber = [];
    if(rows && rows.length > 0) {
      for(let accountData of rows) {
        rowsAccountNumber.push(this.transformDBDataToJsonReport(accountData));
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

  public getFieldsNames() {
    return [{
      label: 'Id',
      value: 'id',
    },{
      label: 'Cuenta',
      value: 'accountNumber',
    },{
      label: 'Emisión',
      value: 'dateF',
    },{
      label: 'T. Comprobante',
      value: 'tipF',
    },{
      label: 'Nro Comprobante',
      value: 'nroTicket',
    },{
      label: 'Vencimiento',
      value: 'expirationDate',
    },{
      label: 'Debito',
      value: 'debF',
    },{
      label: 'Credito',
      value: 'creF',
    },{
      label: 'Saldo Comprobante',
      value: 'salF',
    },{
      label: 'Cotizacion Dolar',
      value: 'cotUsd',
    },{
      label: 'Rubro',
      value: 'rubF',
    },{
      label: 'Referencia',
      value: 'ref',
    }];
  }

  private transformDBDataToJsonReport(accountData) {
    return {
      id: accountData.cua_id,
      accountNumber: accountData.cua_account_number,
      dateF: accountData.cua_fec_f,
      tipF: accountData.cua_tip_f,
      nroTicket: accountData.cua_fa1_f + '-' + accountData.cua_fac_f,
      expirationDate: accountData.cua_vto_f,
      debF: accountData.cua_deb_f,
      creF: accountData.cua_cre_f,
      salF: accountData.cua_sal_f,      
      cotUsd: accountData.cua_cot_usd,
      rubF: accountData.cua_rub_f,
      ref: accountData.cua_ref_f,
    };    
  }

  private transforDBDataToJsonResponse(accountData) {
    return {
      id: accountData.cua_id,
      accountNumber: accountData.cua_account_number,
      dateF: accountData.cua_fec_f,
      tipF: accountData.cua_tip_f,
      fa1F: accountData.cua_fa1_f,
      facF: accountData.cua_fac_f,
      comF: accountData.cua_com_f,
      expirationDate: accountData.cua_vto_f,
      impF: accountData.cua_imp_f,
      debF: accountData.cua_deb_f,
      creF: accountData.cua_cre_f,
      salF: accountData.cua_sal_f,
      difChange: accountData.cua_dif_change,
      cotUsd: accountData.cua_cot_usd,
      ref: accountData.cua_ref_f,
      ctlF: accountData.cua_ctl_f,
      cliC: accountData.cua_cli_c,
      desC: accountData.cua_des_c,
      rexF: accountData.cua_rex_f,
      fccF: accountData.cua_fcc_f,
      xxxF: accountData.cua_xxx_f,
      cilF: accountData.cua_cil_f,
      register: accountData.cua_register,
      salFacF: accountData.cua_sal_f,
      codescuF: accountData.cua_condescu_f,
      rubF: accountData.cua_rub_f,
      nroTicket: accountData.cua_fa1_f + '-' + accountData.cua_fac_f,
    };
  }
}