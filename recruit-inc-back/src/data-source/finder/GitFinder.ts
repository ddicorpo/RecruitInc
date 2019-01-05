import { GitModel } from '../schema/gitSchema';
import { IGitModel } from '../../domain/model/IGitModel';
import { BaseFinder } from './BaseFinder';
import { ITokenModel } from '../../domain/model/ITokenModel';
import { Types } from 'mongoose';

export class GitFinder {
    private baseFinder: BaseFinder = new BaseFinder(GitModel);
  public findById(_id: string): Promise<IGitModel> {
      return this.baseFinder.findById(_id);
  }

  public findByToken(IToken: ITokenModel): Promise<IGitModel> {
      return this.baseFinder.findOneBy({IToken});
  }

  public findAll(): Promise<IGitModel> {
      return this.baseFinder.findAll();
  }
}
