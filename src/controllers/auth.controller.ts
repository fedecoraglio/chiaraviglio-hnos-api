import * as express from 'express';
import UserService from '../services/user.service';

class AuthController {
  
  public authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
    let userData = req.body;
    new UserService().authenticateUser(userData, (user) => {
      res.status(200).json(user);
      next();
    }, (error) => {
      res.status(401).json(error);
      next();
    });
  }

  public ping(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json({ping: 'pong'});
  }

  public createUser(req: express.Request, res: express.Response, next: express.NextFunction): void {    
    new UserService().saveUser(req.body, (userData) => {
      res.status(200).json(userData);
      next();
    }, (errorData) => {
      res.status(409).json(errorData);
      next();
    });
  }

  public requestPassword(req: express.Request, res: express.Response, next: express.NextFunction): void {
    new UserService().sendNewPassword(req.body.email, (emailSent) => {
      res.status(200).json(emailSent);
      next();
    }, (error) => {
      res.status(401).json(error);
      next();
    });
  }
}

export default new AuthController();