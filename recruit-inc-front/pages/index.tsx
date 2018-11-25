import * as React from 'react';
import Header from '../components/Header';
import getConfig from 'next/config';

class App extends React.Component {
  componentDidMount() {
    const { publicRuntimeConfig } = getConfig();
    fetch(`${publicRuntimeConfig.BACK_END_URL}/api/hi`)
      .then(response => {
        return Promise.resolve(response.json());
      })
      .then(data => {
        let items = data;
        console.log('state', items);
      });
  }
  render() {
    return (
      <div>
        <Header />
        <p>Hi from Index</p>
      </div>
    );
  }
}

export default App;
