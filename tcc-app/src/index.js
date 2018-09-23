import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MainLayout from './MainLayout';
import {UserBox} from './controllers/User';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter,Switch, Route, Redirect} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <MainLayout>
        <Route exact path="/" component={App}/>
        <Route path="/users" component={UserBox}/>
      </MainLayout>



    </Switch>

  </BrowserRouter>
  , document.getElementById('layout'));
registerServiceWorker();
