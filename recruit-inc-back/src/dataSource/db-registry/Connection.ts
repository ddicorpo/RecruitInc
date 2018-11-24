export abstract class Connection implements IConnection {
  databaseURL = process.env.DB_HOST;
  databasePassword = process.env.DB_PWD;
  databasePort = process.env.DB_PORT;
  databaseUser = process.env.DB_USER;
  databaseName = process.env.DB_SCHEMA;
  databaseOption = process.env.DB_OPTION;
  protected abstract buildConnection(): any;
  protected abstract getConnectionString(): string;
}
