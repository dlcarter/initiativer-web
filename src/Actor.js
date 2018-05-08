import React, { Component } from 'react';

class Actor extends Component {
  constructor(props) {
    super(props);
    this.onAdance = props.onAdance;
    this.state = props.actor;
  }

  getTotal = () => {
    return this.state.roll + this.state.initiative;
  };

  showMath = () => {
    return this.state.roll + " + " + this.state.initiative;
  };
  
  backgroundClass = () => {
    if (this.state.active) {
      return "background-secondary";
    } else {
      return "";
    }
  };

  handleClick = (e) => {
    if (this.props.actor.active) {
      this.props.onAdvance(e);
    }
  };

  render() {
    return (
      <div
        className={`sm-4 row flex-edges ${this.backgroundClass()}`}
        onClick={this.handleClick}
      >
        <div className="col">
          <p className="margin-none">{this.state.name}</p>
        </div>
        <div className="col">
          <p className="margin-none badge" title={this.showMath()}>{this.getTotal()}</p>
        </div>
      </div>
    );
  }
}

export default Actor;
