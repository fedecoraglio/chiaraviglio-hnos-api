import * as express from 'express';
import GrainStoreService from "../services/grain-store.service";

class GrainStoreController {

  public getGrainStoreDetails(req, res: express.Response, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    new GrainStoreService().getGrainStoreDestails(idLogin, req.params.userId, limit, offset, 
      (grainStoreDetails) => {
        res.status(200).json(grainStoreDetails);
        next();
    }, (grainStoreError) => {
      console.error(grainStoreError);
      res.status(409).json(grainStoreError);
      next();
    });
  }

  public getGrainStoreDetailsSearch(req, res: express.Response, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const searchByCode = req.body.searchByCode || null;
    const searchByCose = req.body.searchByCose || null;
    
    new GrainStoreService().getGrainStoreDestailsFilter(idLogin, req.params.userId, {
      searchByCode: searchByCode,
      searchByCose: searchByCose,
    }, (grainAccountDetails) => {
        res.status(200).json(grainAccountDetails);
        next();
    }, (grainAccountError) => {
      res.status(409).json(grainAccountError);
      next();
    });
  }

  public exportAllGrainStoreExcel(req, res: any, next: express.NextFunction): void {
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    const grainStoreService = new GrainStoreService();
    grainStoreService.getAllGrainStoreDestails(idLogin, req.params.userId,
      grainStoreDetails => {
        const nodeExcel = require('excel-export');
        const dateFormat = require('dateformat');
        const conf = {
          cols: grainStoreService.getGrainStoreExcelColumns(),
          rows: []
        }
        const dataToExport = [];
        for(const gst of grainStoreDetails.items) {          
          const a = [
            gst.accountNumber, 
            dateFormat(gst.expirationDate, 'dd/mm/yyyy'),
            dateFormat(gst.dateDesc, 'dd/mm/yyyy'),
            dateFormat(gst.dateCarga, 'dd/mm/yyyy'),
            gst.code,
            gst.cose,
            gst.peso,
            gst.nomchof,
            gst.nomdesti,
            gst.contrat,
            gst.km,
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
        res.status(409).json(grainAccountError);
        next();
    });
  }
}
export default new GrainStoreController();