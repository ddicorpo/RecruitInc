import * as React from 'react';
import Header from '../components/Header';

class App extends React.Component {
  state = {
    data: 'Will display info here once returned',
    username: '',
    accessToken: '',
    platform: '',
  };

  constructor(props: any) {
    super(props);
    this.state = {
      data: '',
      username: '',
      accessToken: '',
      platform: '',
    };
  }

  handlePlatformChange(event: any) {
    this.setState({ platform: event.target.value });
  }
  handleUsernameChange(event: any) {
    this.setState({ username: event.target.value });
  }
  handleAccessTokenChange(event: any) {
    this.setState({ accessToken: event.target.value });
  }

  onClick = () => {
    let platform: string = this.state.platform;
    let username: string = this.state.username;
    let accessToken: string = this.state.accessToken;

    let url: string =
      'http://localhost:6969' + platform + username + '/' + accessToken;

    return fetch(url)
      .then(response => {
        return Promise.resolve(response.text());
      })
      .then(data => {
        this.setState({ data });
      });
  };

  render() {
    return (
      <div>
        <Header />
        <br />
        <h1>Matching Algorithm:</h1>
        <select name="platform" onChange={this.handlePlatformChange.bind(this)}>
          <option>select platform...</option>
          <option value="/api/github/matchingalgo/">Github</option>
          <option value="/api/gitlab/matchingalgo/">Gitlab</option>
          <option value="/api/bitbucket/applicant/">Bitbucket</option>
        </select>
        <br />
        <br />
        Username:{' '}
        <input
          type="text"
          name="username"
          onChange={this.handleUsernameChange.bind(this)}
        />
        <br />
        <br />
        Access Token:{' '}
        <input
          type="text"
          name="accessToken"
          onChange={this.handleAccessTokenChange.bind(this)}
        />
        <br />
        <br />
        <p>
          {'http://localhost:6969' +
            this.state.platform +
            this.state.username +
            '/' +
            this.state.accessToken}
        </p>
        <button onClick={this.onClick}>Run matching</button>
        <h2>Results from the query: </h2>
        <p>{JSON.stringify(this.state.data)}</p>
      </div>
    );
  }
}

export default App;
