import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MainLayout from './MainLayout';
import {UserBox} from './controllers/User';
import {ResourceBox} from './controllers/Resource';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter,Switch, Route, Redirect} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>

      <MainLayout>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/users" component={UserBox}/>
          <Route path="/resources" component={ResourceBox}/>
        </Switch>
      </MainLayout>





  </BrowserRouter>
  , document.getElementById('layout'));
registerServiceWorker();
