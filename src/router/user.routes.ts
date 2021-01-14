import UserController from '../controllers/user.controller';
import CurrentAccountController from '../controllers/current-account.controller';
import GrainAccountController from '../controllers/grain-account.controller';
import { Router } from 'express';
import grainStoreController from '../controllers/grain-store.controller';
/**
 * @class UserRouter
 */
export default class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        this.router.get('/:userId', UserController.getUserById);
        this.router.get('/:userId/account-details', CurrentAccountController.getCurrentAccountDetails);
        this.router.get('/:userId/account-details/csv', CurrentAccountController.exportAllCurrerntAccountCsv);
        this.router.get('/:userId/account-details/excel', CurrentAccountController.exportAllCurrentAccountExcel);
        this.router.get('/:userId/grain-details', GrainAccountController.getGrainAccountDetails);
        this.router.get('/:userId/grain-details/csv', GrainAccountController.exportAllCurrerntAccountCsv);
        this.router.get('/:userId/grain-details/excel', GrainAccountController.exportAllGrainAccountExcel);
        this.router.get('/:userId/grain-store-details/', grainStoreController.getGrainStoreDetails);
        this.router.get('/:userId/grain-store-details/excel', grainStoreController.exportAllGrainStoreExcel);        
        this.router.post('/:userId/grain-store-details/search', grainStoreController.getGrainStoreDetailsSearch);
        this.router.post('/:userId/account-details/search', CurrentAccountController.getCurrentAccountDetailsSearch);
        this.router.post('/:userId/grain-details/search', GrainAccountController.getGrainAccountDetailsSearch);
        this.router.put('/:userId', UserController.updateUser);
        this.router.put('/:userId/change-pwd', UserController.updatePassword);
    }
}
