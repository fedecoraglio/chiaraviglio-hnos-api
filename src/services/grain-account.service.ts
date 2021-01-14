import GrainAccountModel from '../models/grain-account.model';
import UserService from './user.service';

/**
 * Error codes (201-300):
 * 201: User is not allowed to perform this action
 * 202: get grain account count query data base error message.
 * 203: User not found
 */
export default class GrainAccountService {

  public getGrainAccountDestails(idAuth, idUser, limit = 50, offset = 1, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 201,
        error: "User is not allowed to perform this action"
      });
    } else {
      const grainAccountModel = new GrainAccountModel();
      new UserService().getUserById(idAuth, (userData) => {
        grainAccountModel.getGrainAcountByAccountNumberCount(userData.accountNumber)
        .then((rowsCount) => {
          if(rowsCount && rowsCount.length > 0)  {
            const totalRow = rowsCount[0].total_row;
            grainAccountModel.getGrainAccountByAccountNumber(userData.accountNumber, limit, offset)
            .then((rows) => {
              nextSucess(this.createGrainAccountDataResponse(rows, totalRow, limit, offset));
            }).catch((errorQuery) => {
              nextError({
                code: 202,
                error: errorQuery.sqlMessage
              });
            });
          }
        })
        .catch((errorQuery) => {
          console.error(errorQuery);
          nextError({
            code: 202,
            error: errorQuery.sqlMessage
          });
        })
      }, (error) => {
        console.error(error);
        nextError({
          code: 203,
          error: error
        });
      });
    }
  }

  public getGrainAccountDestailsFilter(idAuth, idUser, filterData, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 201,
        error: "User is not allowed to perform this action"
      });
    } else {
      const grainAccountModel = new GrainAccountModel();
      new UserService().getUserById(idAuth, (userData) => {
        if(filterData) {
          const searchByCode = filterData.searchByCode ? filterData.searchByCode.toUpperCase().trim() : '%%';
          const searchByCose = filterData.searchByCose ? filterData.searchByCose.toUpperCase().trim() : '%%';
          grainAccountModel.getGrainAccountFilter(userData.accountNumber, searchByCode, searchByCose)
          .then((rows) => {
            nextSucess(this.createGrainAccountDataResponse(rows, 0, 0, 0));
          }).catch((errorQuery) => {
            console.error(errorQuery);
            nextError({
              code: 202,
              error: errorQuery.sqlMessage
            });
          });
        }
      }, (error) => {
        nextError({
          code: 203,
          error: error
        });
      });
    }
  }

  public getAllGrainAccountDestails(idAuth, idUser, nextSucess, nextError) {
    if(idAuth !== parseInt(idUser)) {
      nextError({
        code: 201,
        error: "User is not allowed to perform this action"
      });
    } else {
      const grainAccountModel = new GrainAccountModel();
      new UserService().getUserById(idAuth, (userData) => {
        grainAccountModel.getGrainAcountByAccountNumberCount(userData.accountNumber)
        .then((rowsCount) => {
          if(rowsCount && rowsCount.length > 0)  {
            const totalRow = rowsCount[0].total_row;
            grainAccountModel.getGrainAccountByAccountNumber(userData.accountNumber, totalRow, 0)
            .then((rows) => {
              nextSucess(this.createGrainAccountDataReport(rows, totalRow, totalRow, 0));
            }).catch((errorQuery) => {
              nextError({
                code: 202,
                error: errorQuery.sqlMessage
              });
            });
          }
        })
        .catch((errorQuery) => {
          console.error(errorQuery);
          nextError({
            code: 202,
            error: errorQuery.sqlMessage
          });
        })
      }, (error) => {
        console.error(error);
        nextError({
          code: 203,
          error: error
        });
      });
    }
  }

  public getFieldsNames() {
    return [{
      label: 'Cuenta',
      value: 'accountNumber',
    },
    {
      label: 'Tipo',
      value: 'cose',
    },
    {
      label: 'Cosecha',
      value: 'code',
    },
    {
      label: 'Ingreso',
      value: 'amountIn',
    },
    {
      label: 'Egreso',
      value: 'amountOut',
    },
    {
      label: 'Stock',
      value: 'stock',
    }];
  }

  public getGrainAccountExcelColumns() {
    return [{
      caption: 'Cuenta',
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
      caption: 'Ingreso',
      type: 'number',
      width: 10,
    },
    {
      caption: 'Egreso',
      type: 'number',
      width: 10,
    },
    {
      caption: 'Stock',
      type: 'number',
      width: 10,
    }];
  }

  private createGrainAccountDataResponse(rows, totalRow, limit, offset) {
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

  private createGrainAccountDataReport(rows, totalRow, limit, offset) {
    const rowsAccountNumber = [];
    if(rows && rows.length > 0) {
      for(let accountData of rows) {
        rowsAccountNumber.push(this.transforDBDataToJsonReport(accountData));
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

  private transforDBDataToJsonReport(grainAccountData) {
    return {
      accountNumber: grainAccountData.gra_account_number,
      cose: grainAccountData.gra_g_cose,
      code: grainAccountData.gra_g_code,
      amountIn: grainAccountData.gra_g_in,
      amountOut: grainAccountData.gra_g_out,
      stock: grainAccountData.gra_g_stock,
    };
  }

  private transforDBDataToJsonResponse(grainAccountData) {
    return {
      id: grainAccountData.gra_id,
      accountNumber: grainAccountData.gra_account_number,
      idNumber: grainAccountData.gra_g_cuit,
      cliName: grainAccountData.gra_cli_name,
      code: grainAccountData.gra_g_code,
      cose: grainAccountData.gra_g_cose,
      amountIn: grainAccountData.gra_g_in,
      amountOut: grainAccountData.gra_g_out,
      stock: grainAccountData.gra_g_stock,
      grano: grainAccountData.gra_g_grano,
      domici: grainAccountData.gra_g_domici,
      city: grainAccountData.gra_g_city,
      zipCode: grainAccountData.gra_g_zip_code,
      state: grainAccountData.gra_g_state,
    };
  }
}