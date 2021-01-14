import * as express from 'express';
import GrainAccountService from '../services/grain-account.service';

class GrainAccountController {

  public getGrainAccountDetails(req, res: express.Response, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    new GrainAccountService().getGrainAccountDestails(idLogin, req.params.userId, limit, offset, 
      (grainAccountDetails) => {
        res.status(200).json(grainAccountDetails);
        next();
    }, (grainAccountError) => {
      console.error(grainAccountError);
      res.status(409).json(grainAccountError);
      next();
    });
  }

  public getGrainAccountDetailsSearch(req, res: express.Response, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const searchByCode = req.body.searchByCode || null;
    const searchByCose = req.body.searchByCose || null;
    
    new GrainAccountService().getGrainAccountDestailsFilter(idLogin, req.params.userId, {
      searchByCode: searchByCode,
      searchByCose: searchByCose,
    }, (grainAccountDetails) => {
        res.status(200).json(grainAccountDetails);
        next();
    }, (grainAccountError) => {
      console.error(grainAccountError);
      res.status(409).json(grainAccountError);
      next();
    });
  }

  public exportAllCurrerntAccountCsv(req, res: any, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const grainAccountService = new GrainAccountService();
    grainAccountService.getAllGrainAccountDestails(idLogin, req.params.userId,
      grainAccountDetails => {
        const fields = grainAccountService.getFieldsNames();
        const Json2csvParser = require('json2csv').Parser;
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(grainAccountDetails.items);
        res.attachment(`grain-account-details_${new Date().getTime()}.csv`);
        res.status(200).send(csv);
        next();
    }, 
      grainAccountError => {
        console.error(grainAccountError);
        res.status(409).json(grainAccountError);
        next();
    });
  }

  public exportAllGrainAccountExcel(req, res: any, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const grainAccountService = new GrainAccountService();
    grainAccountService.getAllGrainAccountDestails(idLogin, req.params.userId,
      grainAccountDetails => {
        const nodeExcel = require('excel-export');
        const conf = {
          cols: grainAccountService.getGrainAccountExcelColumns(),
          rows: []
        }
        const dataToExport = [];
        for(let ga of grainAccountDetails.items){
          const a = [
            ga.accountNumber, 
            ga.cose, 
            ga.code,
            ga.amountIn,
            ga.amountOut,
            ga.stock,
          ];
          dataToExport.push(a);
        }
        conf.rows = dataToExport;
        const result =nodeExcel.execute(conf);
        res.setHeader('Content-Type','application/vnd.openxmlformates');
        res.setHeader("Content-Disposition","attachment;filename="+"grain_account.xlsx");
        res.end(result,'binary');
        next();
    }, 
      grainAccountError => {
        console.error(grainAccountError);
        res.status(409).json(grainAccountError);
        next();
    });
  }
}
export default new GrainAccountController();