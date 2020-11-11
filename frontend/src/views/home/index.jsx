import React from 'react';
import '../../css/App.css';

import { Example } from '../components/example'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


export const Index = () => {

  return (
    <div className="App">
      <Router>
        <Switch>
            <Route exact path="/" render={(props) => <Example {...props}/>}/>
        </Switch>
      </Router>
    </div>
  )
}
