import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {

  constructor() {
    super();
    this.state = {lista : []};
  }

  componentDidMount(){
    $.ajax({
        url:"http://localhost:3001/users",
        dataType: 'json',
        success:function(resposta){
          this.setState({lista:resposta});
        }.bind(this)
      }
    );
  }

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
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Inicio</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Usuarios</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Recursos</a></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Usuários</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned">
                <div className="pure-control-group">
                  <label htmlFor="first_name">Primeiro Nome</label>
                  <input id="first_name" type="text" name="first_name"/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="last_name">Sobrenome</label>
                  <input id="last_name" type="text" name="last_name" />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="cpf">CPF</label>
                  <input id="cpf" type="text" name="cpf"  />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="cpf">RFID Token</label>
                  <input id="rfid_token" type="text" name="rfid_token"  />
                </div>

                <div className="pure-control-group">
                  <label htmlFor="cpf">Foto Rosto</label>
                  <input type="file" id="facial_bin"name="facial_bin" />
                </div>
                <div className="pure-control-group">
                  <label></label>
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                </div>
              </form>

            </div>
            <div>
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Primeiro Nome</th>
                    <th>Sobrenome</th>
                    <th>CPF</th>
                    <th>Token RFID</th>
                    <th>Foto de Rosto</th>
                    <th>Criado Em</th>
                    <th>Atualizado Em</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.lista.map(function(user){
                      return (
                        <tr key={user._id}>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td>{user.cpf}</td>
                          <td>{user.rfid_token}</td>
                          <td>{user.facial_bin}</td>
                          <td>{user.createdAt}</td>
                          <td>{user.updatedAt}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    );
  }
}

export default App;
