import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

export default class UserRouter {
  public router: Router;

  constructor() {
      this.router = Router();
      this.routes();
  }

  public routes(): void {
      this.router.get('/ping', AuthController.ping);
      this.router.post('/login', AuthController.authenticate);
      this.router.post('/register', AuthController.createUser);
      this.router.post('/reset-password', AuthController.requestPassword);

  }
}