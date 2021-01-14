import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as jwt  from 'jsonwebtoken';
import { default as config } from '../env/index';
import { IServer } from '../interfaces/server.interface';

export default class Middleware {

  static handlerToken(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['authorization'];
    if (token && token.startsWith("Bearer ")) {
      // verifies secret and checks exp
      let tokenParsed = token.substring(7);
      jwt.verify(tokenParsed, config.envConfig.secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          //console.log(req.decoded);
          next();
        }
      }); 
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
          error: 'No token provided.It must have Bearer schema. eg: Bearer token_data'
      });
    }
  }

  static init(server: IServer): void {

    // express middleware
    server.app.use(bodyParser.urlencoded({ extended: false }));
    server.app.use(bodyParser.json());
    server.app.use(cookieParser());
    server.app.use(compression());
    server.app.use(helmet());
    server.app.use(cors());

    server.app.all("/v1/*", (req, res, next) => {
      this.handlerToken(req, res, next);
    });

    // cors
    server.app.use((req, res, next) => {
      //console.log(req.url);
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With,' +
        ' Content-Type, Accept,' +
        ' Authorization,' +
        ' Access-Control-Allow-Credentials'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }
}
