import * as React from 'react';
//import { ObtainRatio } from '../services/ObtainRatio';
import { GithubApiV4 } from '../../../../recruit-inc-back/src/data-extraction/github/githubApiV4';

class RatioFiltering extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  refs: {
    userInput: HTMLInputElement;
  };

  async queryForId(User: string): Promise<string> {
    const accessToken = '';
    let query: string = `query {
                          user(login: "${User}"),
                                id
                              }
                          }`;

    return await new GithubApiV4().queryData(accessToken, query);
  }

  getRatioBaby() {
    /*const ratioservice : ObtainRatio = new ObtainRatio();

  ratioservice.execute().then(
   result
 ) */
    const username = this.refs.userInput.value;
    console.log(username);
    this.queryForId(username);
  }

  onEnter(e: any) {
    if (e.nativeEvent.keyCode !== 13) return;
    e.preventDefault();
    this.getRatioBaby();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h2 className="header-title">Ratio Filtering</h2>
        </div>
        <div className="card">
          <div className="card-header border bottom">
            <h4 className="card-title">Search Filters</h4>
          </div>
          <div className="card-body">
            <div className="row m-t-30">
              <div className="col-md-4">
                <div className="p-h-10">
                  <div className="form-group">
                    <label className="control-label">Language Search</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-h-10">
              <div className="form-group">
                <label className="control-label">Ratio Selection</label>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-h-10">
              <div className="form-group">
                <label className="control-label">City Search</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header border bottom">
            <h4 className="card-title">Results</h4>
          </div>
        </div>

        <div>
          <input
            placeholder="enter your github username"
            ref="userInput"
            type="text"
            onKeyPress={this.onEnter.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default RatioFiltering;
