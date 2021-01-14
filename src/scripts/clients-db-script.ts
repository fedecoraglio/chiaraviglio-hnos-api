const DBFFile = require ('dbffile');
import ClientModel from '../models/client.model';

export default class ClientsDbScript {

  public static openFileAndUpdateToDB() {
    console.info("Starting process dbf");
    DBFFile.open(__dirname+'/exp_sysmae.dbf')
    .then(dbf => {
      console.info(`DBF file contains ${dbf.recordCount} rows.`);
      console.info(`Field names: ${dbf.fields.map(f => f.name)}`);
      return dbf.readRecords();
    })
    .then(rows => {
      const clientModel = new ClientModel();
      const clientData = [];
      rows.forEach(row => {
        const rowData = [];
        if(row) {
          rowData.push(row.S_APELLI);
          rowData.push(row.S_CUI.split("-").join(""));
          rowData.push(row.CLI_C.split(" ").join(""));
          rowData.push(row.S_ZONACU);
          rowData.push(row.S_NROCUE);
          clientData.push(rowData);
        }
      });
      if(clientData.length > 0) {
        console.info("Starting insert client bulk");
        clientModel.truncateClients()
        .then(() => {
          console.info("Deleting all clients rows");
        })
        clientModel.insertClientsBulk(clientData)
        .then((rowInserted) => {
          console.info(`Ending insert client bulk. Affected rows ${rowInserted.affectedRows}`);
        }).catch((clientError) => {
          console.error(clientError);
        });
      }
    })
    .catch(err => console.error('An error occurred: ' + err));
  }
}
