import * as React from 'react';
import Header from '../components/Header';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface IAdminState {
  data: String | {};
}

class App extends React.Component<any, IAdminState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: 'looking..',
    };
  }

  componentDidMount() {
    return fetch(
      `${publicRuntimeConfig.BACK_END_URL}/api/github/applicant/admin`
    )
      .then(response => {
        return Promise.resolve(response.text());
      })
      .then(data => {
        this.setState({ data });
        console.log('state', data);
      });
  }

  render() {
    return (
      <div>
        <Header />
        <p>Hi from admin</p>
        <p>This is the data from the user on the backend: </p>
        <p>{JSON.stringify(this.state.data)}</p>
      </div>
    );
  }
}

export default App;
