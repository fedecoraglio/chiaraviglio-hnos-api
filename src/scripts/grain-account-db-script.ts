const DBFFile = require ('dbffile');
import GrainAccountModel from '../models/grain-account.model';

export default class GrainAccountDbScript {

  static openFileAndUpdateToDB() {
    console.info("Starting grain account process dbf");
    DBFFile.open(__dirname+'/exp_acoprosl.dbf')
    .then(dbf => {
        console.info(`DBF file contains ${dbf.recordCount} current account rows.`);
        console.info(`Current account field names: ${dbf.fields.map(f => f.name)}`);
        return dbf.readRecords();
    })
    .then(rows => {      
      const grainAccountModel = new GrainAccountModel();
      const grainAccount = [];
      rows.forEach(row => {
        const rowData = [];
        if(row) {
          rowData.push(row.CLI_C.split(' ').join(''));
          rowData.push(row.G_CUIT.split("-").join(""));
          rowData.push(row.G_APELLI);
          rowData.push(row.G_CODI);
          rowData.push(row.G_COSE);
          rowData.push(row.G_INGR);
          rowData.push(row.G_SALI);
          rowData.push(row.G_STOK);
          rowData.push(row.G_RAMO);
          rowData.push(row.G_DOMICI);
          rowData.push(row.G_LOCALI);
          rowData.push(row.G_COPOST);
          rowData.push(row.G_PROVIN);
          grainAccount.push(rowData);
        }
      });
      if(grainAccount.length > 0) {
        console.info("Starting insert grain account bulk");
        grainAccountModel.truncateGrainAccountTable()
        .then(() => {
          console.info("Deleting all grain account rows");
          grainAccountModel.insertGrainAccountBulk(grainAccount)
          .then((rowInserted) => {
            console.info(`Ending insert grain bulk. Affected rows ${rowInserted.affectedRows}`);
          }).catch((grainError) => {
            console.error(grainError);
          });
        }).catch((truncateError) => {
          console.error(truncateError);
        });
      }
    })
    .catch(err => console.error('An error occurred: ' + err));
  }
}