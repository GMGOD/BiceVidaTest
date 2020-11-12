import React from 'react';
import '../../css/App.css';

import { Seguro } from '../components/seguro'

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
            <Route exact path="/" render={(props) => <Seguro {...props}/>}/>
        </Switch>
      </Router>
    </div>
  )
}
