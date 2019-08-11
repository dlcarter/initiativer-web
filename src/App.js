import React, { Component } from 'react';
import { MdUndo, MdAdd, MdRestore } from 'react-icons/lib/md';
//import Modal from 'react-modal';
import { default as UUID } from 'uuid/v4';

import 'papercss/dist/paper.css';
import './App.css';

import ActorList from './ActorList';
import ActorAdder from './ActorAdder';
import Randomizer from './Randomizer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "actors": [],
      "new": { "id": -1, "name": "", "roll": 0, "total": 0, "initiative": 0 },
      "rounds": 0,
      "shuffled": false,
      modalIsOpen: false,
    };
    this.randomizer = new Randomizer();
    var self = this;
    setTimeout(function () {
      self.importState();
    });
  }

  resetAll = () => {
    if (window.confirm("Are you sure you want to reset?")) {
      localStorage.removeItem("state");
      this.setState({
        "actors": [],
        "rounds": 0,
        "shuffled": false
      });
      this.fetchCharacters();
    }
  }

  importState = () => {
    var localState = JSON.parse(localStorage.getItem("state"));
    if (localState && localState.actors && localState.actors.length > 0) {
      //this.setState({ actors: localState.actors });
      this.setState(localState);
    } else {
      this.fetchCharacters();
      this.storeState();
    }
  }

  fetchCharacters = () => {
    var self = this;
    fetch("/characters.json").then(function(response) {
      return response.json();
    }).then(function(json) {
      var actors = self.state.actors;
      json.characters.forEach(function(character) {
        actors.push({
          "id": UUID(),
          "name": character.name,
          "initiative": character.initiative,
          "roll": 0,
          "total": 0
        })
      });
      self.setState({ actors: actors });
    });
  }

  storeState = () => {
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  shuffleActors = () => {
    var actors = this.state.actors;
    var self = this;
    this.randomizer.polyRoll(this.state.actors.length).then(function(rolls) { 
      actors.forEach(function(actor) {
        actor.roll = rolls.pop();
        actor.active = false;
        actor.total = actor.roll + actor.initiative;
      });
      actors.sort((a, b) => b.total - a.total);
      actors[0].active = true;
      self.setState({rounds: 0, actors: actors, shuffled: true});
      self.storeState();
    });
  };

  onAdvance = (e) => {
    if (!this.state.shuffled) {
      return;
    }
    var actors = this.state.actors;
    var nextActor = null;
    for (var i = 0; i < actors.length; i++) {
      if (actors[i].active === true) {
        actors[i].active = false;
        if (i+1 >= actors.length) {
          nextActor = actors[0];
          this.setState({rounds: this.state.rounds+1});
        } else {
          nextActor = actors[i+1];
        }
      }
    }
    nextActor.active = true;
    this.setState({actors: actors});
    this.storeState();
  };

  undo = () => {
    if (!this.state.shuffled) {
      return
    }
    var actors = this.state.actors;
    if (actors[0].active === true && this.state.rounds === 0) {
      // Can't rewind further than the beginning
      return
    }
    var nextActor = null;
    for (var i = 0; i < actors.length; i++) {
      if (actors[i].active === true) {
        actors[i].active = false;
        if (i-1 < 0) {
          nextActor = actors[actors.length-1];
          this.setState({rounds: this.state.rounds-1});
        } else {
          nextActor = actors[i-1];
        }
      }
    }
    nextActor.active = true;
    this.setState({actors: actors});
    this.storeState();
  }


  onDelete = (actorToDelete) => {
    var actors = this.state.actors;
    if (window.confirm("Are you sure you want to delete?")) {
      actors.forEach(function(actor, idx) {
        if (actor.id === actorToDelete.id) {
          actors.splice(idx, 1);
        }
      });
    }
    this.setState({ actors: actors });
    this.storeState();
  }
  
  addActor = (actor) => {
    var actors = this.state.actors;
    var dupedActor = JSON.parse(JSON.stringify(actor));
    actors.push(dupedActor);
    this.setState({
      actors: actors
    });

    this.storeState();
  }

  render() {
    return (
      <div className="paper">
        <div className="row flex-center">
          <h3 className="margin-none">Initiativer</h3>
        </div>
        <div className="row flex-center">
          <h4 className="margin-none">Round {this.state.rounds + 1}</h4>
        </div>
        <div className="row flex-center">
          <button className="btn-small" onClick={this.shuffleActors} disabled={this.state.shuffled}>Roll for initiative!</button>
          <button className="btn-small" onClick={this.onAdvance} disabled={!this.state.shuffled}>Advance >></button>
          <button className="btn-small" onClick={this.undo} disabled={!this.state.shuffled}><MdUndo /></button>
        </div>
        <ActorList actors={this.state.actors} onAdvance={this.onAdvance} onDelete={this.onDelete} />
        <div className="row flex-center">
          <ActorAdder addActor={this.addActor} />
          <button className="btn-small" onClick={this.resetAll}><MdRestore /></button>
        </div>
      </div>
    );
  }
}

export default App;