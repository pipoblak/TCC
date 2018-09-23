import React, {Component} from 'react';

export default class CustomButton extends Component{
  constructor(){
    super();
  }
  render(){
    return(
      <div className="pure-control-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <button id={this.props.id} type={this.props.type} name={this.props.name} className={this.props.className} onClick={this.props.onClick}>{this.props.text}</button>
      </div>
    );
  }
}
