import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
    };
  }
// If you look in your console your should see: state object with all 
// the grettings from our node ExpressJS server on port 6969
  componentDidMount() {
    fetch("http://localhost:6969/api/hi")
    .then(results => {
      return results.json()
    }).then(data => {
    let items = data
    this.setState({items: items});
    console.log("state", this.state.items);
  })
  }
  render() {
      return (
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>

        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
      );
      }
    }

export default App;
