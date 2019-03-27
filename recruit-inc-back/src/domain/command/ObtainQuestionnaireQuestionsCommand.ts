import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { QuestionsFinder } from '../../data-source/finder/QuestionsFinder';
import { IQuestionsModel } from '../model/IQuestionModel';

export class ObrtainQuestionaireQuestionsCommand extends AbstractCommand {
  private finder: QuestionsFinder = new QuestionsFinder();

  constructor(applicationContext?: RequestContext) {
    super();
  }

  public async getQuestionnaireResults(
    page: number,
    filters: string[]
  ): Promise<any> {
    try {
      const query =
        filters.length > 0
          ? filters
              .map(filter => {
                return {
                  // todo
                };
              })
              .reduce((aggregate, item) => Object.assign(aggregate, item), {})
          : {};

      //Prevent crash of the application by inserting page=-1 or page=0
      if (page < 1) {
        page = 1;
      }

      let allQuestions: IQuestionsModel[] = await this.finder.findAll();

      return JSON.stringify(allQuestions);
    } catch (CommandException) {
      throw CommandException;
    }
  }
}
