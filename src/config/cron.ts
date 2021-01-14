import { CronJob } from 'cron';
import ClientsDbScript from '../scripts/clients-db-script';
import CurrentAccountDbScript from '../scripts/current-account-db-script';
import GrainAccountDbScript from '../scripts/grain-account-db-script';
import FtpClientAccount from '../scripts/ftp-client-account';
import GrainStoreDbScript from '../scripts/grain-store-db.script';

//It is going to run every 13 minutes
const CRON_INVERVAL_CURRENT_ACCOUNT: string = '*/13 * * * *';

//It is going to run every 26 minutes
const CRON_INTERVAL_GRAIN: string = '*/26 * * * *';

/**
 * @class Cron
 */
export default class Cron {

  private static updateCurrentAccountAndClientsTable(): void {
    new CronJob(CRON_INVERVAL_CURRENT_ACCOUNT, (): void => {
      console.info('Calling update current account cron ' + new Date());
      FtpClientAccount.startDownloadAllFileProcess(() => {
        CurrentAccountDbScript.openFileAndUpdateToDB();
        ClientsDbScript.openFileAndUpdateToDB();
      });
    }, null, true);
  }

  private static updateGrainAccountAndGrainStoreTable() {
    new CronJob(CRON_INTERVAL_GRAIN, (): void => {
      console.info('Calling update grain account and grain store table cron ' + new Date());
      FtpClientAccount.startDownloadAllFileProcess(() => {
        GrainAccountDbScript.openFileAndUpdateToDB();
        GrainStoreDbScript.openFileAndUpdateToDB();
      });
    }, null, true);
  }

  // init
  static init(): void {
    Cron.updateCurrentAccountAndClientsTable();
    Cron.updateGrainAccountAndGrainStoreTable();
  }
}