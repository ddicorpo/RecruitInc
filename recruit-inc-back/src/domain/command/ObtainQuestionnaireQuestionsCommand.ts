import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { QuestionsFinder } from '../../data-source/finder/QuestionsFinder';
import { IQuestionsModel } from '../model/IQuestionModel';

export class ObtainQuestionaireQuestionsCommand extends AbstractCommand {
  private finder: QuestionsFinder = new QuestionsFinder();

  constructor(applicationContext?: RequestContext) {
    super();
  }

  public async getQuestionnaireQuestions(): Promise<any> {
    try {
      let allQuestions: IQuestionsModel[] = await this.finder.findAll();

      return JSON.stringify(allQuestions);
    } catch (CommandException) {
      throw CommandException;
    }
  }
}
