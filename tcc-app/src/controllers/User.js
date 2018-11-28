import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PubSub from 'pubsub-js';
import ErrorHandling from "./ErrorHandling";
var db_url = "http://192.168.43.15:3001/";
var rasp_url = "192.168.43.15:8083"
// rasp_url = "localhost:8083"

// db_url = "http://localhost:3001/";
export class UserBox extends Component{
  constructor() {
    super();
    this.state = {lista : []};
  }

  componentDidMount(){
    $.ajax({
        url:db_url+"users",
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
      url:db_url+"users",
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
        <UserForm />
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
      facial_bin: '',
      biometric_bin: ''
    };
    this.submitUser = this.submitUser.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setCpf = this.setCpf.bind(this);
    this.setRfidToken = this.setRfidToken.bind(this);
    this.setFacialBin = this.setFacialBin.bind(this);
    this.setFingerPrint = this.setFingerPrint.bind(this);
    this.loadRfidToken = this.loadRfidToken.bind(this);
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
  loadRfidToken(event){
    let target = $(event.target);
    target.attr("placeholder","Aguarde...");
    $.ajax({
        url:"http://"+rasp_url+"/status",
        dataType: 'text',
        success:function(resposta){
          target.attr("placeholder","Passe o Cartão e Aguarde...");

          $.ajax({
              url:"http://"+rasp_url+"/getRFID",
              dataType: 'text',
              success:function(resposta2){
                target.val(resposta2);
                target.attr("placeholder","");
              }.bind(this),
              error: function(resposta2){
                target.attr("placeholder","Erro de Comunicação.");
              }});
        }.bind(this),
        error: function(resposta){
          target.attr("placeholder","Erro de Comunicação.");
        }});
  }
  setFingerPrint(event){
    let target = $(event.target);
    let holder = target.parents(".pure-control-group");

    if(holder.find(".status").length<=0){
      holder.append('<span class="status"></span>');
    }
    let status = holder.find(".status");
    status.html("&nbsp;Aguarde um Momento...")
    let fingerData1="";
    let fingerData2="";
    let stateHolder = this;

    //Check Status WebServer
    $.ajax({
        url:"http://"+rasp_url+"/status",
        dataType: 'text',
        success:function(resposta){
          status.html("&nbsp;Insira o Dedo desejado e aguarde...");
          //Get FingerData1
          $.ajax({
              url:"http://"+rasp_url+"/get_finger1",
              dataType: 'text',
              success:function(resposta1){
                fingerData1=resposta1;
                status.html("&nbsp;Retire o Dedo e Insira novamente...");
                //Get FingerData2
                $.ajax({
                    url:"http://"+rasp_url+"/get_finger2",
                    dataType: 'text',
                    success:function(resposta2){
                      fingerData2=resposta2;
                      status.html("&nbsp;Aguarde um Momento...");
                      //GET TEMPLATE
                      $.ajax({
                          url:"http://"+rasp_url+"/get_finger_template",
                          dataType: 'text',
                          success:function(resposta3){
                            stateHolder.setState({biometric_bin: resposta3});
                            status.html("&nbsp;OK!");
                          }.bind(this),
                          error: function(resposta){
                            status.text("Erro de Comunicação.4");
                          }
                        }
                      );
                    }.bind(this),
                    error: function(resposta){
                      status.text("Erro de Comunicação.3");
                    }
                  }
                );
              }.bind(this),
              error: function(resposta){
                status.text("Erro de Comunicação.2");
              }
            }
          );
        }.bind(this),
        error: function(resposta){
          status.text("Erro de Comunicação.");
        }
      }
    );

  }
  updateUser(user){
    console.log("OI")
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
    formData.append('biometric_bin', this.state.biometric_bin);
    let stateHolder = this;
    if(this.state.biometric_bin==''){
      new ErrorHandling().publishError({message:"Por favor, insira uma FingerPrint!"});
    }
    else{
      $.ajax({
        url: db_url + "users",
        cache: false,
        contentType: false,
        processData: false,
        type:"POST",
        data: formData,
        success: function(result){
          PubSub.publish('user-list',result)
          stateHolder.setState({
            first_name: '',
            last_name: '',
            rfid_token: '',
            cpf: '',
            facial_bin: '',
            biometric_bin: ''
          })

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
            <CustomInput id="rfid_token" type="text" name="user[rfid_token]"  value={this.state.rfid_token} onChange={this.setRfidToken} label="RFID Token" onDoubleClick={this.loadRfidToken}></CustomInput>
            <CustomInput id="facial_bin" type="file" name="user[facial_bin]"  onChange={this.setFacialBin} label="Foto Rosto"></CustomInput>
            <CustomButton type="button" className="pure-button pure-button-secondary" text="Carregar FingerPrint" onClick={this.setFingerPrint} label="FingerPrint"></CustomButton>
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
      url: db_url+"users/"+user_id,
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
  editUser(event){
    let target = $(event.target);
    let row  = target.parents("tr");
    let user_id = row.attr("data-id");
    if(target.attr("edit")=="true"){

    }
    else{
      $.ajax({
        url: db_url+"users/"+user_id,
        contentType: "application/json",
        type:"GET",
        data:{},
        success: function(result){
          $.each(row.find("input"),function(i,e){
            $(e).prop("readOnly",false)
          });
          $("#first_name").val(result.first_name)
          $("#last_name").val(result.last_name)
          $("#cpf").val(result.cpf)
          $("#rfid_token").val(result.rfid_token)

          // console.log(result)
          // this.props.sharedInfo.UserForm.setState(result);
        }.bind(this),
        error: function(result){
          console.log("error")
          console.log(result)
        }
      });
    }


  }
  constructor() {
    super();
    this.deleteUser = this.deleteUser.bind(this);
    this.editUser = this.editUser.bind(this);
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
                    <td><button onClick={this.deleteUser}>X</button><button onClick={this.editUser}>Edit</button></td>
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
