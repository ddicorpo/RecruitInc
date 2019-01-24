import { ICandidate } from '../model/Candidate/ICandidate';
import { baseAdapter } from './baseAdapter';

export class CandidateAdapter extends baseAdapter {
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
