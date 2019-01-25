import { ICandidate } from '../model/Candidate/ICandidate';
import { BaseAdapter } from './BaseAdapter';

/**
 * This class prevents dependency between our domain model back-end
 * and our domain model front-end
 */
export class CandidateAdapter extends BaseAdapter {
  constructor() {
    super();
  }

  public adapt(jsonObj: JSON): ICandidate[] {
    let candidates: ICandidate[] = [];
    //TODO: Convert Server Object to candidates obj...
    //TODO : make a resilance converter based on the testData.json
    return candidates;
  }
}
