import { AbstractCommand } from './abstractCommand';

export class SaveDataEntryCommand extends AbstractCommand {
  public execute() {
    console.log('SaveEntry Command');
  }
}
