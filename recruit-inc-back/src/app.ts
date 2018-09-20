import * as express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { Examples } from "./routes/examples";

class App {

    public app: express.Application;
    public myDataRoute: Examples = new Examples();

    constructor() {
        this.app = express(); //run the express instance and store in app
        this.config();
        this.myDataRoute.routes(this.app);
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
