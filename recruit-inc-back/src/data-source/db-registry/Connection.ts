import { IConnection } from './IConnection';

export abstract class Connection implements IConnection {
  databaseURI = process.env.DB_URI;
  databaseName = process.env.DB_NAME;
  protected abstract buildConnection(): any;
  protected abstract getConnectionString(): string;
}
