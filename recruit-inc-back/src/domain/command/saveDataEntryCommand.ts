import { AbstractCommand } from './AbstractCommand';

export class SaveDataEntryCommand extends AbstractCommand {
  public execute() {
    console.log('SaveEntry Command');
  }
}
