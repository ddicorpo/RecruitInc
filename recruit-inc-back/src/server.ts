import app from './app';
import fetch from 'node-fetch';
import { MongoConnectionFactory } from './data-source/db-registry/mongo/MongoConnectionFactory';
import { CronJobs } from './cron-job/CronJobs';
const PORT = process.env.PORT || 6969;
const DEFAULT_TIMEOUT: number = parseInt(process.env.DEFAULT_TIMEOUT);

let fflip = require('fflip');

/**
 * Connecting to database using default .env setting
 */
function connectToDatabase(): void {
  console.log('Connecting to database ');
  let mongoConn: MongoConnectionFactory = new MongoConnectionFactory();
  mongoConn.defaultInitialization();
  mongoConn.getConnection();
}

var server = app.listen(PORT, async () => {
  console.log('Listening on PORT => ' + PORT);
  connectToDatabase();
  await retrieveToggleFeature();
});

async function retrieveToggleFeature(): Promise<void> {
  console.log('Retrieving toggle feature configs ');
  fflip.config({
    criteria: await getCriteria(),
    features: await getFeature(),
  });
  //Toggle enabled for new feature rollout. (example)
  if (fflip.features.newFeatureRollout.enabled) {
    console.log('New Feature Rollout is Enabled');
  }
}

function getFeature(): Promise<any> {
  return fetch(
    process.env.DOMAIN_TOGGLE_FEATURE +
      ':' +
      process.env.PORT_TOGGLE_FEATURE +
      '/backend/feature',
    { method: 'get' }
  ).then(response => response.json());
}
function getCriteria(): Promise<any> {
  return fetch(
    process.env.DOMAIN_TOGGLE_FEATURE +
      ':' +
      process.env.PORT_TOGGLE_FEATURE +
      '/backend/criteria',
    { method: 'get' }
  ).then(response => response.json());
}

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
