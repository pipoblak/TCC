import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import {Link} from 'react-router-dom';
class MainLayout extends Component {
  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>
        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="#">Proactive Access</a>
            <ul className="pure-menu-list">
              <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Inicio</Link></li>
              <li className="pure-menu-item"><Link to="/users" className="pure-menu-link">Usuarios</Link></li>
              <li className="pure-menu-item"><Link to="/resources" className="pure-menu-link">Recursos</Link></li>
              <li className="pure-menu-item"><Link to="/user_resources" className="pure-menu-link">Usuários de Recursos</Link></li>
          </ul>
          </div>
        </div>

        <div id="main">
          {this.props.children}
        </div>


      </div>
    );
  }
}

export default MainLayout;
