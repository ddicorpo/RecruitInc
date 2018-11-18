import * as React from 'react';
import Header from '../components/Header';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class App extends React.Component {
  state = {
    username: '',
    data: '',
  };

  constructor(props: any) {
    super(props);
    try {
      this.state = {
        username: localStorage.getItem('username') || '',
        data: '',
      };
    } catch (e) {
      this.state = {
        username: '',
        data: '',
      };
    }
  }

  handleChange(event: any) {
    this.setState({ username: event.target.value });
    localStorage.setItem('username', event.target.value);
  }

  componentDidMount() {
    let url: string = window.location.href;
    let platform: string = url.substring(
      url.indexOf('platform=') + 9,
      url.indexOf('&')
    );
    let code: string = url.substring(url.indexOf('code=') + 5);
    let token: string = url.substring(
      url.indexOf('access_token=') + 13,
      url.indexOf('&token_type=')
    );

    if (url.indexOf('code=') != -1) {
      return fetch(
        `${
          publicRuntimeConfig.BACK_END_URL
        }/api/oauth/oauthcode/${platform}/${code}/${this.state.username}`
      )
        .then(response => {
          return Promise.resolve(response.text());
        })
        .then(data => {
          this.setState({ data });
        });
    }

    //for GITLAB specifically, since token is return directly here instead of code
    if (url.indexOf('access_token=') != -1) {
      return fetch(
        `${
          publicRuntimeConfig.BACK_END_URL
        }/api/oauth/oauthcode/gitlab/${token}/${this.state.username}`
      )
        .then(response => {
          return Promise.resolve(response.text());
        })
        .then(data => {
          this.setState({ data });
        });
    }
    return;
  }

  render() {
    return (
      <div>
        <Header />
        <br />
        <form>
          Recruit.Inc Username:{' '}
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange.bind(this)}
          />
        </form>
        <p>Information for: {this.state.username}</p>
        <p>
          You can login to the following platforms to allow Recruit.Inc to
          assess your skills.
        </p>
        <a
          style={{ display: 'table-cell' }}
          href={
            'https://bitbucket.org/site/oauth2/authorize?client_id=thwTU3aUh8ZBQNXyXA&response_type=code'
          }
        >
          BitBucket
        </a>
        <br />
        <a
          style={{ display: 'table-cell' }}
          href={
            'https://github.com/login/oauth/authorize?client_id=1908c6dc58ef2187341f&redirect_uri=http://localhost:3000/profile?username=' +
            this.state.username +
            '?platform=github'
          }
        >
          Github
        </a>
        <br />
        <a
          style={{ display: 'table-cell' }}
          href={
            'https://gitlab.com/oauth/authorize?client_id=cf78ad0e83e8c8f5e4cc8b60ef0250e1d1a299cd9f3ec91ec9d54399eb52e102&redirect_uri=http://localhost:3000/profile?platform=gitlab&response_type=token'
          }
        >
          Gitlab
        </a>
        <p>{JSON.stringify(this.state.data)}</p>
      </div>
    );
  }
}

export default App;
