const DBFFile = require ('dbffile');
import CurrentAccountModel from '../models/current-account.model';

export default class CurrentAccountDbScript {

  public static openFileAndUpdateToDB() {
    console.info("Starting current account process dbf");
    DBFFile.open(__dirname+'/exp_ctares.dbf')
    .then(dbf => {
        console.info(`DBF file contains ${dbf.recordCount} current account rows.`);
        console.info(`Current account field names: ${dbf.fields.map(f => f.name)}`);
        return dbf.readRecords();
    })
    .then(rows => {
      const currentAccountModel = new CurrentAccountModel();
      const currentAccount = [];
      rows.forEach(row => {
        const rowData = [];
        if(row) {
          rowData.push(row.CLI_F.split(' ').join(''));
          rowData.push(row.FEC_F);
          rowData.push(row.TIP_F.split(" ").join(""));
          rowData.push(row.FA1_F);
          rowData.push(row.FAC_F);
          rowData.push(row.COM_F);
          rowData.push(row.VTO_F);
          rowData.push(row.IMP_F);
          rowData.push(row.DEB_F);
          rowData.push(row.CRE_F);
          rowData.push(row.SAL_F);
          rowData.push(row.DIF_CAMBIO);
          rowData.push(row.COT_DOL);
          rowData.push(row.REF_F);
          rowData.push(row.CTL_F.split(' ').join(''));
          rowData.push(row.CLI_C.split(' ').join(''));
          rowData.push(row.DES_C);
          rowData.push(row.REX_F);
          rowData.push(row.FCC_F);
          rowData.push(row.XXX_F);
          rowData.push(row.CIL_F);
          rowData.push(row.REGISTRO);
          rowData.push(row.SALFAC_F);
          rowData.push(row.CONDESCU_F);
          rowData.push(row.RUB_F);
          currentAccount.push(rowData);
        }
      });
      if(currentAccount.length > 0) {
        console.info("Starting insert current account bulk");
        currentAccountModel.truncateCurrentAccountTable()
        .then(() => {
          console.info("Deleting all current account rows");
          currentAccountModel.insertCurrentAccountBulk(currentAccount)
          .then((rowInserted) => {
            console.info(`Ending insert current account bulk. Affected rows ${rowInserted.affectedRows}`);
          }).catch((currentError) => {
            console.error(currentError);
          });
        }).catch((truncateError) => {
          console.error(truncateError);
        })
      }
    })
    .catch(err => console.error('An error occurred: ' + err));
  }
}