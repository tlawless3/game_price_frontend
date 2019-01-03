import React, { Component } from 'react';
import { Home, Results } from './components/index'
import { Route, Switch } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' render={() => (<Home />)} />
        </Switch>
      </div>
    );
  }
}

export default App;
