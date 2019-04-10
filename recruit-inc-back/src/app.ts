import express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { ApplicantGithub } from './routes/github/applicantGithub';
import { Candidate } from './routes/github/candidate';
import { OAuthCode } from './routes/OAuth/OAuthCode';
import { Logger } from './Logger';
import { LocationsRoute } from './routes/locations/LocationsRoute';
import { TechnologiesRoute } from './routes/technologies/TechnologiesRoute';
import { CandidatesRoute } from './routes/candidates/CandidatesRoute';
import { QuestionsRoute } from './routes/questions/QuestionsRoute';
import { ResultsRoute } from './routes/results/ResultsRoute';
var cors = require('cors');

class App {
  public app: express.Application;
  public candidateDataRoute: Candidate = new Candidate();
  public applicantGithub: ApplicantGithub = new ApplicantGithub();
  public candidateDataRout: Candidate = new Candidate();
  public oauthCodeRoute: OAuthCode = new OAuthCode();
  public locationRoute: LocationsRoute = new LocationsRoute();
  public techRoute: TechnologiesRoute = new TechnologiesRoute();
  public candidateRoute: CandidatesRoute = new CandidatesRoute();
  public questionRoute: QuestionsRoute = new QuestionsRoute();
  public resultsRoute: ResultsRoute = new ResultsRoute();
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
        corsOptions = { origin: true };
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
    this.candidateDataRoute.routes(this.app);
    this.applicantGithub.routes(this.app);
    this.candidateDataRout.routes(this.app);
    this.oauthCodeRoute.routes(this.app);
    this.locationRoute.routes(this.app);
    this.techRoute.routes(this.app);
    this.candidateRoute.routes(this.app);
    this.questionRoute.routes(this.app);
    this.resultsRoute.routes(this.app);
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
