import React from 'react';
import '../../css/App.css';

import { Plan } from '../components/plan'

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
            <Route exact path="/" render={(props) => <Plan {...props}/>}/>
        </Switch>
      </Router>
    </div>
  )
}
