import * as express from 'express';
import CurrentAccountService from '../services/current-account.service';

class CurrentAccountController {

  public getCurrentAccountDetails(req, res: express.Response, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    new CurrentAccountService().getCurrentAccountDestails(idLogin, req.params.userId, limit, offset, 
      (currentAccountDetails) => {
        res.status(200).json(currentAccountDetails);
        next();
    }, (currentAccountError) => {
      res.status(401).json(currentAccountError);
      next();
    });
  }

  public exportAllCurrerntAccountCsv(req, res: any, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const currentAccountService = new CurrentAccountService();
    currentAccountService.getAllCurrentAccountByAccountNumber(idLogin, 
      currentAccountDetails => {
        const fields = currentAccountService.getFieldsNames();
        const Json2csvParser = require('json2csv').Parser;
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(currentAccountDetails.items);
        res.attachment(`current-account-details_${new Date().getTime()}.csv`);
        res.status(200).send(csv);
        next();
    }, 
      currentAccountError => {
        res.status(409).json(currentAccountError);
        next();
    });
  }

  public exportAllCurrentAccountExcel(req, res: any, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const currentAccountService = new CurrentAccountService();
    currentAccountService.getAllCurrentAccountByAccountNumber(idLogin, 
      currentAccountDetails => {
        const nodeExcel = require('excel-export');
        const dateFormat = require('dateformat');
        const conf = {
          cols: currentAccountService.getCurrentAccountExcelColumns(),
          rows: []
        }
        const dataToExport = [];
        for(let ca of currentAccountDetails.items){
          const a = [            
            ca.id, 
            ca.accountNumber, 
            dateFormat(ca.dateF, 'dd/mm/yyyy'), 
            ca.tipF,
            ca.nroTicket,
            dateFormat(ca.expirationDate, 'dd/mm/yyyy'),
            ca.debF,
            ca.creF,
            ca.cotUsd,
            ca.ref,
          ];
          dataToExport.push(a);
        }
        conf.rows = dataToExport;
        const result =nodeExcel.execute(conf);
        res.setHeader('Content-Type','application/vnd.openxmlformates');
        res.setHeader("Content-Disposition","attachment;filename="+"current_account.xlsx");
        res.end(result,'binary');
        next();
    }, 
    currentAccountError => {
      res.status(409).json(currentAccountError);
      next();
    });
  }

  public getCurrentAccountDetailsSearch(req, res: express.Response, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const createdStartDate = req.body.createdStartDate || null;
    const createdEndDate = req.body.createdEndDate || null;
    const expirationStartDate = req.body.expirationStartDate || null;
    const expirationEndDate = req.body.expirationEndDate || null;
    
    new CurrentAccountService().getCurrentAccountDestailsFilter(idLogin, req.params.userId, {
      createdStartDate: createdStartDate,
      createdEndDate: createdEndDate,
      expirationStartDate: expirationStartDate,
      expirationEndDate: expirationEndDate,
    },
      (currentAccountDetails) => {
        res.status(200).json(currentAccountDetails);
        next();
    }, (currentAccountError) => {
      res.status(401).json(currentAccountError);
      next();
    });
  }
}

export default new CurrentAccountController();