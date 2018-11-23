class MongoConnectionFactory extends ConnectionFactory {
  public getConnection(): MongoConnection {
    //TODO: Return a Mongo Connection
    return new MongoConnection();
  }

  public defaultInitialization(): void {}
}
