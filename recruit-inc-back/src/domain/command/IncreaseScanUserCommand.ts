import { AbstractCommand } from './AbstractCommand';
import { CronFinder } from '../../data-source/finder/CronFinder';
import { RequestContext } from './RequestContext';
import { ICronModel } from '../model/ICronModel';
import { CronTDG } from '../../data-source/table-data-gateway/cronTDG';

export class IncreaseScanUserCommand extends AbstractCommand {
  private finder: CronFinder = new CronFinder();
  private cronTDG: CronTDG = new CronTDG();

  constructor(applicationContext?: RequestContext) {
    super();
  }

  public async increasedByOne(location: string): Promise<Boolean> {
    try {
      let targetCronStatus: ICronModel = await this.finder.findByLocation(
        location
      );

      let newCount: number = targetCronStatus.number_scanned + 1;
      //Prevent increase to be larger than total number
      if (newCount > targetCronStatus.total_number) {
        newCount = targetCronStatus.total_number;
      }
      targetCronStatus.number_scanned = newCount;

      const successful: Boolean = await this.cronTDG.update(
        targetCronStatus._id,
        targetCronStatus
      );

      if (successful) {
        this.logActionCompleted(this.increasedByOne.name);
      } else {
        this.logActionFailure(
          this.increasedByOne.name,
          'Failure',
          "Can't increase user scanned by one!"
        );
      }

      return new Promise(function(resolve, reject) {
        if (successful) {
          resolve(successful);
        } else {
          reject(Error("Can't increase user scanned by one!"));
        }
      });
    } catch (CommandException) {
      this.logActionFailure(
        this.increasedByOne.name,
        CommandException.name,
        CommandException.message
      );
    }
  }
}
