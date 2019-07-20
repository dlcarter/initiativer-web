import React, { Component } from 'react';
import cx from 'classnames';

class Actor extends Component {
  getTotal = () => {
    const { actor } = this.props;
    return actor.roll + actor.initiative;
  };

  showMath = () => {
    const { actor } = this.props;
    return `Roll[${actor.roll}] + Init[${actor.initiative}]`;
  };

  handleClick = (e) => {
    const { actor, onAdvance, onDelete } = this.props;
    if (actor.active) {
      onAdvance(e);
    } else {
      onDelete(actor);
    }
  };

  render() {
    const { actor } = this.props;
    const containerClasses = cx('sm-4', 'row', 'flex-edges', {
      'background-secondary': actor.active
    });

    return (
      <div
        className={containerClasses}
        onClick={this.handleClick}
      >
        <div className="col">
          <p className="margin-none">{actor.name}</p>
        </div>
        <div className="col">
          <p className="margin-none badge" title={this.showMath()}>{this.getTotal()}</p>
        </div>
      </div>
    );
  }
}

export default Actor;
