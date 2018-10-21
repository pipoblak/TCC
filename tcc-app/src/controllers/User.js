import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PubSub from 'pubsub-js';
import ErrorHandling from "./ErrorHandling";
export class UserBox extends Component{
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

    PubSub.subscribe('user-list', function(topico,result){
      let current_list = this.state.lista;
      if(result.constructor==Array){
        current_list=result;
      }else{
        current_list.push(result)
      }
      this.setState({lista:current_list});
    }.bind(this));
  }
  notifyChange(){
    $.ajax({
      url:"http://localhost:3001/users",
      contentType: "application/json",
      type:"GET",
      success: function(result){
        PubSub.publish('user-list',result)
      },
      error: function(result){
        console.log("error")
        console.log(result)
      }
    });
  }
  render(){
    return(
      <div>
        <UserForm/>
        <UserTable lista={this.state.lista} notifyChange={this.notifyChange}/>
      </div>
    );
  }
}

export class UserForm extends Component{
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
    let file = event.target.files[0];
    this.setState({facial_bin: file});
  }
  //Evento que cria ou atualiza usuários
  submitUser(event){
    event.preventDefault();
    let form = $(event.target);
    let formData = new FormData();
    formData.append('facial_bin', this.state.facial_bin);
    formData.append('first_name', this.state.first_name);
    formData.append('last_name', this.state.last_name);
    formData.append('rfid_token', this.state.rfid_token);
    formData.append('cpf', this.state.cpf);

    $.ajax({
      url:"http://localhost:3001/users",
      cache: false,
      contentType: false,
      processData: false,
      type:"POST",
      data: formData,
      success: function(result){
        PubSub.publish('user-list',result)
      },
      error: function(result){
        if(result.status===400){
          new ErrorHandling().publishError(result.responseJSON);
        }
        else{

        }
        console.log("error")
        console.log(result)
      }
    });
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro Usuarios </h1>
        </div>
        <div className="pure-form pure-form-aligned">
          <form className="pure-form pure-form-aligned" onSubmit={this.submitUser} method="post">
            <br></br>
            <CustomInput id="first_name" type="text" name="user[first_name]" value={this.state.first_name} onChange={this.setFirstName} label="Primeiro Nome"></CustomInput>
            <CustomInput id="last_name" type="text" name="user[last_name]" value={this.state.last_name} onChange={this.setLastName} label="Sobrenome"></CustomInput>
            <CustomInput id="cpf" type="text" name="user[cpf]" value={this.state.cpf} onChange={this.setCpf} label="CPF"></CustomInput>
            <CustomInput id="rfid_token" type="text" name="user[rfid_token]"  value={this.state.rfid_token} onChange={this.setRfidToken} label="RFID Token"></CustomInput>
            <CustomInput id="facial_bin" type="file" name="user[facial_bin]"  onChange={this.setFacialBin} label="Foto Rosto"></CustomInput>
            <CustomButton type="submit" className="pure-button pure-button-primary" text="Gravar"></CustomButton>
          </form>

        </div>
      </div>

    );
  }
}
export class UserTable extends Component {
  deleteUser(event){
    let target = $(event.target);
    let user_id = target.parents("tr").attr("data-id");
    $.ajax({
      url:"http://localhost:3001/users/"+user_id,
      contentType: "application/json",
      type:"DELETE",
      data:{},
      success: function(result){
        if(result.status==200)
          this.props.notifyChange();
      }.bind(this),
      error: function(result){
        console.log("error")
        console.log(result)
      }
    });

  }
  constructor() {
    super();
    this.deleteUser = this.deleteUser.bind(this);
  }
  render() {
    return (
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
              <th>Açōes</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(user){
                return (
                  <tr data-id={user._id} key={user._id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.cpf}</td>
                    <td>{user.rfid_token}</td>
                    <td>{user.facial_bin_path}</td>
                    <td>{user.createdAt}</td>
                    <td>{user.updatedAt}</td>
                    <td><button onClick={this.deleteUser}>X</button></td>
                  </tr>
                );
              }.bind(this))
            }
          </tbody>
        </table>
      </div>
    );
  }
}
