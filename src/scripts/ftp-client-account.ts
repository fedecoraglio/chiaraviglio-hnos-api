const DBFFile = require ('dbffile');
const ftpClient = require('ftp-client');
import { default as config } from '../env/index';

export default class FtpClientAccount {

  static startDownloadAllFileProcess(callbackFunction) {
    const client = FtpClientAccount.createFtpClient();
    client.connect(function(data) {
      client.download(config.envConfig.ftpserver.filePath, __dirname, {
        overwrite: 'older'
      }, function (result) {
        if(result && result.downloadedFiles.length > 0) {
          console.info("Getting all files");
          callbackFunction();
        } else {
          console.info("All files are up to date");
        }
      });
    });
  }

  public static createFtpClient() {
    const client = new ftpClient({
      host: config.envConfig.ftpserver.host,
      port: config.envConfig.ftpserver.port,
      user: config.envConfig.ftpserver.user,
      password: config.envConfig.ftpserver.password
    }, {
      logging: config.envConfig.ftpserver.logging
    });
    return client;
  }
}