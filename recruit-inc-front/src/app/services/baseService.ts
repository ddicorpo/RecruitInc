import { Logger } from '../Logger';

export abstract class baseService {
  private logger: Logger;
  serviceName: string;
  serviceAddress: string;
  BackEndAddress: string =
    process.env.BACK_END_ADDRESS + ':' + process.env.BACK_END_PORT;
  protected constructor() {
    this.logger = new Logger();
  }

  /**
   * Main method to execute a transaction
   */
  abstract async execute(): Promise<any>;

  /**
   * Use by other Service class, it used to build the API address
   * @param apiMethod
   */
  buildServiceAddress(apiMethod: string): string {
    return process.env.REST_PREFIX + this.BackEndAddress + apiMethod;
  }

  /**
   * Log successful transaction with a service
   * @param serviceName
   */
  logActionCompleted(serviceName: string): void {
    console.log('action complete ' + serviceName);
    this.logger.info({
      class: serviceName,
      method: this.execute.name,
      action: '(FE) API Transaction Completed with API ' + this.serviceAddress,
      params: {},
    });
  }

  /**
   * Log unsuccessful transaction with a service
   * @param serviceName
   * @param errorName
   * @param errorDesc
   */
  logActionFailure(
    serviceName: string,
    errorName: string,
    errorDesc: string
  ): void {
    console.log('action complete ' + serviceName);
    this.logger.info({
      class: serviceName,
      method: this.execute.name,
      action:
        '(FE) API Transaction Fails with API ' +
        this.serviceAddress +
        ' reason: ' +
        errorName +
        ' desc: ' +
        errorDesc,
      params: {},
    });
  }
}
