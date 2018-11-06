import * as express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { Examples } from "./routes/examples";
import { ApplicantGithub } from "./routes/github/applicantGithub";
import { StackOverflowRoute } from './routes/stackoverflow/stackOverflowRoute';
import { GitlabApplicants } from "./routes/gitlab/GitlabApplicants"
import { Candidate} from "./routes/github/candidate";
import {ApplicantBitbucket} from "./routes/bitbucket/applicantBitbucket";
import {OAuthCode} from "./routes/OAuth/OAuthCode";

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
        this.app = express(); //run the express instance and store in app
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
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
    }

}

export default new App().app;
