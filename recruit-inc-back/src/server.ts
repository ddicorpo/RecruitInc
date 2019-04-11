import app from './app';
import { MongoConnectionFactory } from './data-source/db-registry/mongo/MongoConnectionFactory';
import { ToggleFeature } from './toggle-feature/ToggleFeature';
import { CronJobs } from './cron-job/CronJobs';
const PORT = process.env.PORT || 6969;
const DEFAULT_TIMEOUT: number = parseInt(process.env.DEFAULT_TIMEOUT);
let newFeatureRollout: boolean = false;
let cronActive: boolean = false;

/**
 * Connecting to database using default .env setting
 */
function connectToDatabase(): void {
  console.log('Connecting to database ');
  let mongoConn: MongoConnectionFactory = new MongoConnectionFactory();
  mongoConn.defaultInitialization();
  mongoConn.getConnection();
}

async function setToggles(): Promise<void> {
  let toggleFeature: ToggleFeature = new ToggleFeature();
  await toggleFeature.retrieveToggleFeature();

  newFeatureRollout = toggleFeature.getNewFeatureRollout();
  cronActive = toggleFeature.getCronActive();
}

var server = app.listen(PORT, async () => {
  console.log('Listening on PORT => ' + PORT);
  connectToDatabase();

  setToggles()
    .then(function() {
      if (cronActive) {
        scheduleCron();
      } else {
        console.log(
          'Cron job will NOT be scheduled to run. (Make sure to enable the toggle feature cronActive)'
        );
      }
    })
    .catch(function(error) {
      console.log(
        'Error with toggle for cron job or scheduling. More info: ' + error
      );
    });
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
function scheduleCron(): void {
  console.log('The Cron Job is scheduled to run');
  let cronjob: CronJobs = new CronJobs();
  cronjob.scheduleCron();
  cronjob.cronKeyRotation(); //for key rotations
  cronjob.updateMatchingAlgo(); //launches the update
}

/**
 * Setup the CORS, if we are in production we want rules
 * In Dev, we don't really care,
 * We want to enforce the use of the cors object
 */
