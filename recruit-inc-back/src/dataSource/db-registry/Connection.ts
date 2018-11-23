abstract class Connection implements IConnection {
  contructor() {}

  databaseURL = process.env.DB_HOST;
  databasePassword = process.env.DB_PWD;
  databasePort = process.env.DB_PORT;
  databaseUser = process.env.DB_USER;
  databaseName = process.env.DB_SCHEMA;
  databaseOption = '';
}
