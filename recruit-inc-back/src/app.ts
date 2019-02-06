import * as express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { Examples } from './routes/examples';
import { ApplicantGithub } from './routes/github/applicantGithub';
import { Candidate } from './routes/github/candidate';
import { OAuthCode } from './routes/OAuth/OAuthCode';
import { MvpRoute } from './routes/MvpRoute';
import { Logger } from '../src/Logger';
var cors = require('cors');

class App {
  public app: express.Application;
  public myDataRoute: Examples = new Examples();
  public candidateDataRoute: Candidate = new Candidate();
  public applicantGithub: ApplicantGithub = new ApplicantGithub();
  public candidateDataRout: Candidate = new Candidate();
  public oauthCodeRoute: OAuthCode = new OAuthCode();
  public mvpRoute: MvpRoute = new MvpRoute();
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
    // Import all env. variable
    require('dotenv').config();

    let logCors: number = 0;

    let whitelistDomain: string[] = [
      process.env.DOMAIN_FRONT_END,
      process.env.DOMAIN_BACK_END,
    ];
    console.log('WHITE LIST ' + whitelistDomain);
    console.log('NODE ENV ==> ' + process.env.NODE_ENV);

    var corsOptionsDelegate = function(req, callback) {
      var corsOptions;
      if (
        (whitelistDomain.indexOf(req.header('Origin')) !== -1 ||
          whitelistDomain.indexOf(req.header('host')) !== -1) &&
        process.env.NODE_ENV === 'production'
      ) {
        //this.logAction('constructor', 'CORS Enabled for PROD');
        logCors = 1;
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
      } else if (process.env.NODE_ENV === 'dev') {
        // this.logAction('constructor', 'CORS Enabled for DEV');
        logCors = 2;
        corsOptions = { origin: false }; // disable CORS for this request
      } else {
        //this.logAction('constructor', 'CORS disabled for unknown');
        corsOptions = { origin: callback(new Error("Can't process request")) };
      }
      callback(null, corsOptions); // callback expects two parameters: error and options
    };

    this.app = express();
    //Logging for Cors must be done here or else you get : "TypeError: Cannot read property 'logAction' of undefined"
    if (logCors === 1) this.logAction('constructor', 'CORS Enabled for PROD');
    else if (logCors === 2)
      this.logAction('constructor', 'CORS Enabled for DEV');
    else this.logAction('constructor', 'CORS disabled for unknown');

    this.app.use(cors(corsOptionsDelegate));
    this.config();
    this.myDataRoute.routes(this.app);
    this.candidateDataRoute.routes(this.app);
    this.applicantGithub.routes(this.app);
    this.candidateDataRout.routes(this.app);
    this.oauthCodeRoute.routes(this.app);
    this.mvpRoute.routes(this.app);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
  }

  private logAction(methodName: string, message: string): void {
    this.logger.info({
      class: 'app.ts',
      method: methodName,
      action: message,
      params: {},
    });
  }
}

export default new App().app;
