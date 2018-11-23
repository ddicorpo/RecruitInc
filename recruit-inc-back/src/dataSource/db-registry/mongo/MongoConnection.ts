export class MongoConnection {
  databaseURL = 'mongodb+srv://';
  databasePassword = 'admin';
  //databasePort = process.env.DB_PORT;
  databaseUser = 'admin';
  databaseName = '@cluster0';
  databaseOption = '-urrz3.mongodb.net/test?retryWrites=true';

  public buildConnection(): string {
    return (
      this.databaseURL +
      this.databaseUser +
      ':' +
      this.databasePassword +
      this.databaseName +
      this.databaseOption
    );
  }
}
