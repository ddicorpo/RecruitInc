import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ApplicantFinder } from '../../data-source/finder/ApplicantFinder';
import { IApplicantModel } from '../model/IApplicantModel';

export class IsCandidateInStorageCommand extends AbstractCommand {
  private finder: ApplicantFinder = new ApplicantFinder();

  constructor(applicationContext?: RequestContext) {
    super();
  }

  public async isCandidateIn(username: string): Promise<Boolean> {
    try {
      const applicantFound: IApplicantModel = await this.finder.findByPlatformUsername(
        username
      );

      let isInStorage: Boolean = false;

      if (applicantFound != null && applicantFound != undefined) {
        isInStorage = true;
      }

      this.logActionCompleted(this.isCandidateIn.name);

      return new Promise(function(resolve) {
        resolve(isInStorage);
      });
    } catch (CommandException) {
      this.logActionFailure(
        this.isCandidateIn.name,
        'Failure',
        "Can't Find user is false"
      );
    }
  }
}
