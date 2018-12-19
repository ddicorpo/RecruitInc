import * as express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { Examples } from './routes/examples';
import { ApplicantGithub } from './routes/github/applicantGithub';
import { StackOverflowRoute } from './routes/stackoverflow/stackOverflowRoute';
import { GitlabApplicants } from './routes/gitlab/GitlabApplicants';
import { Candidate } from './routes/github/candidate';
import { ApplicantBitbucket } from './routes/bitbucket/applicantBitbucket';
import { OAuthCode } from './routes/OAuth/OAuthCode';
var cors = require('cors');

class App {
  public app: express.Application;
  public myDataRoute: Examples = new Examples();
  public candidateDataRoute: Candidate = new Candidate();
  public applicantBitbucketDataRoute: ApplicantBitbucket = new ApplicantBitbucket();
  public applicantGithub: ApplicantGithub = new ApplicantGithub();
  public stackOverFlowRoute: StackOverflowRoute = new StackOverflowRoute();
  public gitlabApplicant: GitlabApplicants = new GitlabApplicants();
  public candidateDataRout: Candidate = new Candidate();
  public oauthCodeRoute: OAuthCode = new OAuthCode();

  constructor() {
    // Import all env. variable
    require('dotenv').config();

    let whitelistDomain: string[] = [process.env.DOMAIN_FRONT_END, process.env.DOMAIN_BACK_END];
    var corsOptionsDelegate = function(req, callback) {
      var corsOptions;
      if (whitelistDomain.indexOf(req.header('Origin')) !== -1) {
        console.log('CORS Enabled for => PROD');
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
      } else if (process.env.NODE_ENV === 'dev') {
        console.log('CORS Enabled for => DEV');
        corsOptions = { origin: false }; // disable CORS for this request
      } else {
        console.log('CORS Disabled for => UNKNOWN');
        corsOptions = { origin: callback(new Error("Can't process request")) };
      }
      callback(null, corsOptions); // callback expects two parameters: error and options
    };

    this.app = express();
    this.app.use(cors(corsOptionsDelegate));
    this.config();
    this.myDataRoute.routes(this.app);
    this.candidateDataRoute.routes(this.app);
    this.applicantBitbucketDataRoute.routes(this.app);
    this.applicantGithub.routes(this.app);
    this.stackOverFlowRoute.routes(this.app);
    this.gitlabApplicant.routes(this.app);
    this.candidateDataRout.routes(this.app);
    this.oauthCodeRoute.routes(this.app);
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
}

export default new App().app;
