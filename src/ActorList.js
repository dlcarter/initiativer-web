import React, { Component } from 'react';
import Actor from './Actor'

class ActorList extends Component {
  actorList = () => {
    return this.props.actors.map((actor, index) => (
      <Actor key={actor.id} actor={actor} onAdvance={this.props.onAdvance} onDelete={this.props.onDelete} />
    ));
  };

  render() {
    return (
      <div className="flex-spaces child-borders">
        {this.actorList()}
      </div>
    );
  }
}

export default ActorList;
