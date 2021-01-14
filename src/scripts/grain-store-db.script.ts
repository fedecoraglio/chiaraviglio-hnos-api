const DBFFile = require ('dbffile');

import { default as config } from '../env/index';
import GrainStoreModel from '../models/grain-store.model';

export default class GrainStoreDbScript {
  
  static openFileAndUpdateToDB() {
    console.info("Starting grain store process dbf");
    DBFFile.open(__dirname+'/exp_acohis.dbf')
    .then(dbf => {
        //console.info(`DBF file contains ${dbf.recordCount} grain store rows.`);
        //console.info(`grain store field names: ${dbf.fields.map(f => f.name)}`);
        return dbf.readRecords();
    })
    .then(rows => {      
      const grainStoreModel = new GrainStoreModel();
      const grainStore = [];
      rows.forEach((row) => {
        const rowData = [];
        if(row) {
          rowData.push(row.CLI_C.split(' ').join(''));
          rowData.push(row.G_TIPCP);
          rowData.push(row.G_ROMAN);
          rowData.push(row.G_NUMCP);
          rowData.push(row.G_CTG);
          rowData.push(row.G_FECHA);
          rowData.push(row.G_FECDESC);
          rowData.push(row.G_FECARGA);
          rowData.push(row.G_COSE);
          rowData.push(row.G_CODI);
          rowData.push(row.G_NOMCHOF);
          rowData.push(row.G_OBSER1);
          rowData.push(row.G_BRUTO);
          rowData.push(row.G_TARA);
          rowData.push(row.G_PORZARA);
          rowData.push(row.G_ZARAN);
          rowData.push(row.G_PESO);
          rowData.push(row.G_HUME);
          rowData.push(row.G_PORHUM);
          //rowData.push(row.G_MERMHUM);
          rowData.push(row.G_PORVOLA);
          rowData.push(row.G_MERVOLA);
          rowData.push(row.G_NETO);
          rowData.push(row.G_CARDES);
          rowData.push(row.G_CERTIA);
          rowData.push(row.G_CODGEO);
          rowData.push(row.G_CODLOC);
          rowData.push(row.G_PROVIN);
          rowData.push(row.G_CONTRAT);
          rowData.push(row.G_CTL);
          rowData.push(row.G_LOCALI);
          rowData.push(row.G_LOTE);
          rowData.push(row.G_DESLOTE);
          rowData.push(row.G_PATCHAS);
          rowData.push(row.GR_TARFLET);
          rowData.push(row.G_TARFLET);
          rowData.push(row.G_KILOMETR);
          rowData.push(row.G_GRADO);
          rowData.push(row.G_PROTEI);
          rowData.push(row.G_FACTOR);
          rowData.push(row.G_CTADESTI.split(' ').join(''));
          rowData.push(row.G_NOMDESTI);
          rowData.push(row.G_CTAPLADE.split(' ').join(''));
          rowData.push(row.G_NOMPLADE);
          rowData.push(row.G_CTACORR.split(' ').join(''));
          rowData.push(row.G_NOMCOR);
          rowData.push(row.G_CTATRA.split(' ').join(''));
          rowData.push(row.G_NOMTRAN);
          grainStore.push(rowData);
        }        
      });
      if(grainStore.length > 0) {
        console.info("Starting insert grain store bulk");
        grainStoreModel.truncateGrainStoreTable()
        .then(() => {
          console.info("Deleting all grain store rows");
          grainStoreModel.insertGrainStoreBulk(grainStore)
          .then((rowInserted) => {
            console.info(`Ending insert grain store bulk. Affected rows ${rowInserted.affectedRows}`);
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