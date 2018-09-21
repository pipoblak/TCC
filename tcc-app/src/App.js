import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {

  constructor() {
    super();
    this.state = {
      lista : [],
      first_name: '',
      last_name: '',
      rfid_token: '',
      cpf: '',
      facial_bin: ''
    };
    this.submitUser = this.submitUser.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setCpf = this.setCpf.bind(this);
    this.setRfidToken = this.setRfidToken.bind(this);
    this.setFacialBin = this.setFacialBin.bind(this);
    // this.getUsers = this.getUsers.bind(this);
  }

  componentDidMount(){
    this.getUsers = function(){
      $.ajax({
          url:"http://localhost:3001/users",
          dataType: 'json',
          success:function(resposta){
            this.setState({lista:resposta});
          }.bind(this)
        }
      );
    }
    this.getUsers();
  }


  setFirstName(event){
    this.setState({first_name:event.target.value});
  }
  setLastName(event){
    this.setState({last_name:event.target.value});
  }
  setCpf(event){
    this.setState({cpf:event.target.value});
  }
  setRfidToken(event){
    this.setState({rfid_token:event.target.value});
  }
  setFacialBin(event){
    let target = $(event.target);
    target.attr('loaded',"false");
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file)
    reader.addEventListener('load', function(){
      let facial_bin = reader.result;
      target.attr('loaded',"true");
      this.setState({facial_bin: facial_bin});
    }.bind(this));
  }
  //Evento que cria ou atualiza usuários
  submitUser(event){
    event.preventDefault();
    let form = $(event.target);
    let user = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      rfid_token: this.state.rfid_token,
      cpf: this.state.cpf,
      facial_bin: this.state.facial_bin
    }
    $.ajax({
      url:"http://localhost:3001/users",
      type:"POST",
      dataType:"json",
      data: user,
      success: function(result){
        console.log(result)
        this.getUsers()
      }.bind(this),
      error: function(result){
        console.log(result)
      }
    });
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
              <form className="pure-form pure-form-aligned" onSubmit={this.submitUser} method="post">
                <div className="pure-control-group">
                  <label htmlFor="first_name">Primeiro Nome</label>
                  <input id="first_name" type="text" name="user[first_name]" value={this.state.first_name} onChange={this.setFirstName}/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="last_name">Sobrenome</label>
                  <input id="last_name" type="text" name="user[last_name]" value={this.state.last_name} onChange={this.setLastName}/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="cpf">CPF</label>
                  <input id="cpf" type="text" name="user[cpf]"  value={this.state.cpf} onChange={this.setCpf}/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="cpf">RFID Token</label>
                  <input id="rfid_token" type="text" name="user[rfid_token]"  value={this.state.rfid_token} onChange={this.setRfidToken}/>
                </div>

                <div className="pure-control-group">
                  <label htmlFor="cpf">Foto Rosto</label>
                  <input type="file" id="facial_bin"name="user[facial_bin]"  onChange={this.setFacialBin}/>
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
