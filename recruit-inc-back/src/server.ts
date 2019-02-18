import app from './app';
import { MongoConnectionFactory } from './data-source/db-registry/mongo/MongoConnectionFactory';
import { CronJobs } from './cron-job/CronJobs';
const PORT = process.env.PORT || 6969;
const DEFAULT_TIMEOUT: number = parseInt(process.env.DEFAULT_TIMEOUT);

/**
 * Connecting to database using default .env setting
 */
function connectToDatabase(): void {
  console.log('Connecting to database ');
  let mongoConn: MongoConnectionFactory = new MongoConnectionFactory();
  mongoConn.defaultInitialization();
  mongoConn.getConnection();
}

var server = app.listen(PORT, () => {
  console.log('Listening on PORT => ' + PORT);
  connectToDatabase();
});

/**
 * Node js has a default timeout of 2 minutes for routes
 * Since our application tends to have routes that run
 * several queries (and take a really long time)
 * This can be an issue. If a route is called and it doesn't end before nodejs
 * Times out, the server automatically makes a new call to the route
 * triggering an infinite loop since the new call will not finish
 * under 2 minutes thus triggering a new call etc. The line below is to avoid that
 *
 */
server.setTimeout(DEFAULT_TIMEOUT);
console.log('Server DEFAULT TIMEOUT =>  ' + DEFAULT_TIMEOUT);

//Set cronjob on app startup
let cronjob: CronJobs = new CronJobs();
cronjob.scheduleCron();


/**
 * Setup the CORS, if we are in production we want rules
 * In Dev, we don't really care,
 * We want to enforce the use of the cors object
 */
