import React, { Component } from 'react';
import Actor from './Actor'

class ActorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "actors": props.actors
    };
  };

  actorList = () => {
    return this.state.actors.map((actor, index) => (
      <Actor key={actor.id} actor={actor} onAdvance={this.props.onAdvance} />
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
