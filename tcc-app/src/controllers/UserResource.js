import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PubSub from 'pubsub-js';
import ErrorHandling from "./ErrorHandling";
export class UserResourceBox extends Component{
  constructor() {
    super();
    this.state = {lista : []};
  }

  componentDidMount(){
    $.ajax({
        url:"http://localhost:3001/user_resources",
        dataType: 'json',
        success:function(resposta){
          this.setState({lista:resposta});
        }.bind(this)
      }
    );

    PubSub.subscribe('user_resource-list', function(topico,result){
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
      url:"http://localhost:3001/user_resources",
      contentType: "application/json",
      type:"GET",
      success: function(result){
        PubSub.publish('user_resource-list',result)
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
        <UserResourceForm/>
        <UserResourceTable lista={this.state.lista} notifyChange={this.notifyChange}/>
      </div>
    );
  }
}

export class UserResourceForm extends Component{
  constructor() {
    super();
    this.state = {
      lista : [],
      type: '',
      action_id: '',
      target: ''
    };
    this.submitUserResource = this.submitUserResource.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.setResourceId = this.setResourceId.bind(this);
    this.setActive = this.setActive.bind(this);
    // this.getUsers = this.getUsers.bind(this);
  }
  componentDidMount(){
      $.ajax({
          url:"http://localhost:3001/user_resources",
          dataType: 'json',
          success:function(resposta){
            this.setState({lista:resposta});
          }.bind(this)
        }
      );
    PubSub.subscribe('user_resource-list', function(topico,result){
      let current_list = this.state.lista;
      if(result.constructor==Array){
        current_list=result;
      }else{
        current_list.push(result)
      }
      this.setState({lista:current_list});
    }.bind(this));
  }
  setUserId(event){
    this.setState({user_id:event.target.value});
  }
  setResourceId(event){
    this.setState({resource_id:event.target.value});
  }
  setActive(event){
    this.setState({active:event.target.checked});
  }
  //Evento que cria ou atualiza usuario de recurso
  submitUserResource(event){
    event.preventDefault();
    let form = $(event.target);
    let user_resource = {
      user_id: this.state.user_id,
      resource_id: this.state.resource_id,
      active: this.state.active
    }
    let lista = this.state.lista;
    let unique = true;
    console.log(lista)
    let each_uniquiness = $.each(lista,function(i,e){
      console.log(e)
      if(e.resource_id == user_resource.resource_id && e.user_id==user_resource.user_id)
        unique = false;
    });
    if(unique){
      $.ajax({
        url:"http://localhost:3001/user_resources",
        contentType: "application/json",
        type:"POST",
        data: JSON.stringify(user_resource),
        success: function(result){
          PubSub.publish('user_resource-list',result)
        },
        error: function(result){
          // if(result.status===400){
          //   new ErrorHandling().publishError(result.responseJSON);
          // }
          // else{
          //
          // }
          console.log("error")
          console.log(result)
        }
      });
    }
    else{
      new ErrorHandling().publishError({message:"UserResource já existe!"});
    }

  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro Usuários de Recursos </h1>
        </div>
        <div className="pure-form pure-form-aligned">
          <form className="pure-form pure-form-aligned" onSubmit={this.submitUserResource} method="post">
            <br></br>
            <CustomInput id="user_id" type="text" name="user_resource[user_id]" value={this.state.user_id} onChange={this.setUserId} label="User ID"></CustomInput>
            <CustomInput id="resource_id" type="text" name="user_resource[resource_id]" value={this.state.resource_id} onChange={this.setResourceId} label="Resource ID"></CustomInput>
            <CustomInput id="active" type="checkbox" name="user_resource[active]" value={this.state.active} onChange={this.setActive} label="Ativo?"></CustomInput>
            <CustomButton type="submit" className="pure-button pure-button-primary" text="Gravar"></CustomButton>
          </form>

        </div>
      </div>

    );
  }
}
export class UserResourceTable extends Component {
  deleteUserResource(event){
    let target = $(event.target);
    let resource_id = target.parents("tr").attr("data-id");
    $.ajax({
      url:"http://localhost:3001/user_resources/"+resource_id,
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
    this.deleteUserResource = this.deleteUserResource.bind(this);
    this.updateActive = this.updateActive.bind(this);
  }
  updateActive(event){
    let target = $(event.target);
    let resource_id = target.parents("tr").attr("data-id");
    let check = target[0].checked;
    $.ajax({
      url:"http://localhost:3001/user_resources/"+resource_id,
      contentType: "application/json",
      type:"PATCH",
      data:JSON.stringify({active: check}),
      success: function(result){
        window.location.reload()
        // target.prop("checked",check)
        // if(result.status==200)
        //   this.props.notifyChange();
      }.bind(this),
      error: function(result){
        console.log("error")
        console.log(result)
      }
    });
  }
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>User_ID</th>
              <th>Resource_ID</th>
              <th>ACTIVE</th>
              <th>Açōes</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(user_resource){
                return (
                  <tr data-id={user_resource._id} key={user_resource._id}>
                    <td>{user_resource.user_id}</td>
                    <td>{user_resource.resource_id}</td>
                    <td><input type="checkbox" checked={user_resource.active} onClick={this.updateActive}></input></td>
                    <td><button onClick={this.deleteUserResource}>X</button></td>
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
