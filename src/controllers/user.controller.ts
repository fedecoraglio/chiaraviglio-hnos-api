import * as express from 'express';
import UserService from '../services/user.service';

class UserController {

  public getUserById(req: express.Request, res: express.Response, next: express.NextFunction): void {
    new UserService().getUserById(req.params.userId, (userData) => {
      res.status(200).json(userData);
      next();
    }, (userError) => {
      res.status(409).json(userError);
      next();
    });
  }

  public updatePassword(req, res: express.Response, next: express.NextFunction): void {
    const userData = req.body;
    userData.id = parseInt(req.params.userId);
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    new UserService().updatePassword(idLogin, userData, (userUpdated) => {
      res.status(200).json(userUpdated);
      next();
    }, (userError) => {
      res.status(409).json(userError);
      next();
    });
  }

  public updateUser(req, res: express.Response, next: express.NextFunction): void {
    const userData = req.body;
    userData.id = parseInt(req.params.userId);
    const idLogin = req.decoded ? parseInt(req.decoded.id) : -1;
    new UserService().updateUser(idLogin, userData, (userUpdated) => {
      res.status(200).json(userUpdated);
      next();
    }, (userError) => {
      res.status(409).json(userError);
      next();
    });
  }
}

export default new UserController();
