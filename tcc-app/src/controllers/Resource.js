import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PubSub from 'pubsub-js';
import ErrorHandling from "./ErrorHandling";
export class ResourceBox extends Component{
  constructor() {
    super();
    this.state = {lista : []};
  }

  componentDidMount(){
    $.ajax({
        url:"http://localhost:3001/resources",
        dataType: 'json',
        success:function(resposta){
          this.setState({lista:resposta});
        }.bind(this)
      }
    );

    PubSub.subscribe('resource-list', function(topico,result){
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
      url:"http://localhost:3001/resources",
      contentType: "application/json",
      type:"GET",
      success: function(result){
        PubSub.publish('resource-list',result)
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
        <ResourceForm/>
        <ResourceTable lista={this.state.lista} notifyChange={this.notifyChange}/>
      </div>
    );
  }
}

export class ResourceForm extends Component{
  constructor() {
    super();
    this.state = {
      lista : [],
      type: '',
      action_id: '',
      target: ''
    };
    this.submitResource = this.submitResource.bind(this);
    this.setType = this.setType.bind(this);
    this.setActionId = this.setActionId.bind(this);
    this.setTarget = this.setTarget.bind(this);
    // this.getUsers = this.getUsers.bind(this);
  }
  setType(event){
    this.setState({type:event.target.value});
  }
  setActionId(event){
    this.setState({action_id:event.target.value});
  }
  setTarget(event){
    this.setState({target:event.target.value});
  }
  //Evento que cria ou atualiza recurso
  submitResource(event){
    event.preventDefault();
    let form = $(event.target);
    let resource = {
      type: this.state.type,
      action_id: this.state.action_id,
      target: this.state.target
    }
    $.ajax({
      url:"http://localhost:3001/resources",
      contentType: "application/json",
      type:"POST",
      data: JSON.stringify(resource),
      success: function(result){
        PubSub.publish('resource-list',result)
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

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro Recursos </h1>
        </div>
        <div className="pure-form pure-form-aligned">
          <form className="pure-form pure-form-aligned" onSubmit={this.submitResource} method="post">
            <br></br>
            <CustomInput id="first_name" type="text" name="resource[type]" value={this.state.type} onChange={this.setType} label="Tipo"></CustomInput>
            <CustomInput id="last_name" type="text" name="resource[action_id]" value={this.state.action_id} onChange={this.setActionId} label="Action ID"></CustomInput>
            <CustomInput id="cpf" type="text" name="resource[target]" value={this.state.target} onChange={this.setTarget} label="Target"></CustomInput>
            <CustomButton type="submit" className="pure-button pure-button-primary" text="Gravar"></CustomButton>
          </form>

        </div>
      </div>

    );
  }
}
export class ResourceTable extends Component {
  deleteResource(event){
    let target = $(event.target);
    let resource_id = target.parents("tr").attr("data-id");
    $.ajax({
      url:"http://localhost:3001/resources/"+resource_id,
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
    this.deleteResource = this.deleteResource.bind(this);
  }
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Action ID</th>
              <th>Target</th>
              <th>Açōes</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(resource){
                return (
                  <tr data-id={resource._id} key={resource._id}>
                    <td>{user_resource._id}</td>
                    <td>{resource.type}</td>
                    <td>{resource.action_id}</td>
                    <td>{resource.target}</td>
                    <td><button onClick={this.deleteResource}>X</button></td>
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
