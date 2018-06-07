import React, { Component } from 'react';
import { MdUndo, MdAdd, MdRestore } from 'react-icons/lib/md';
import Modal from 'react-modal';
import { default as UUID } from 'uuid/v4';

import 'papercss/dist/paper.css';
import './App.css';

import ActorList from './ActorList'

Modal.setAppElement('#root');

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

  shuffle = () => {
    console.log("shufflin");
    var actors = this.state.actors;
    var self = this;
    this.fetchRolls(this.state.actors.length).then(function(rolls) {
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
  }

  fetchRolls = (size) => {
    var url = "https://api.random.org/json-rpc/1/invoke";
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc":"2.0",
        "method":"generateIntegers",
        "params": {
          "apiKey":"00000000-0000-0000-0000-000000000000",
          "n":size,
          "min":1,
          "max":20
        },
        "id":UUID()
      })
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log("fetchRolls", json.result.random.data);
      return json.result.random.data;
    });
  }

  roll20 = () => (Math.floor(Math.random() * 19) + 1);

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

  addActor = (e) => {
    e.preventDefault();
    var newActor = this.state.new;
    newActor.roll = 0;
    newActor.id = UUID();
    var actors = this.state.actors;
    actors.push(newActor);
    this.setState({
      actors: actors,
      "new": { "id": -1, "name": "", "roll": 0, "total": 0, "initiative": 0 },
    });
    this.closeModal();
    this.storeState();
  }

  handleNewName = (e) => {
    var newActor = this.state.new;
    newActor.name = e.target.value;
    this.setState({ new: newActor });
  }

  handleNewInitiative = (e) => {
    var newActor = this.state.new;
    newActor.initiative = parseInt(e.target.value, 10);
    if (isNaN(newActor.initiative)) {
      newActor.initiative = 0;
    }
    this.setState({ new: newActor });
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

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
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
          <button className="btn-small" onClick={this.shuffle} disabled={this.state.shuffled}>Roll for initiative!</button>
          <button className="btn-small" onClick={this.onAdvance} disabled={!this.state.shuffled}>Advance >></button>
          <button className="btn-small" onClick={this.undo} disabled={!this.state.shuffled}><MdUndo /></button>
        </div>
        <ActorList actors={this.state.actors} onAdvance={this.onAdvance} onDelete={this.onDelete} />
        <div className="row flex-center">
          <button className="btn-small" onClick={this.openModal}><MdAdd /></button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Example Modal"
          >
            <form>
              <div className="form-group">
                <label htmlFor="newName">Name</label>
                <input id="newName" type="text" value={this.state.new.name} onChange={this.handleNewName} />
              </div>
              <div className="form-group">
                <label htmlFor="newInitiative">Initiative bonus</label>
                <input id="newInitiative" type="text" value={this.state.new.initiative} onChange={this.handleNewInitiative} />
              </div>
              <button className="btn-small" onClick={this.addActor}>Save</button>
              <button className="btn-small" onClick={this.closeModal}>Cancel</button>
            </form>
          </Modal>
          <button className="btn-small" onClick={this.resetAll}><MdRestore /></button>
        </div>
      </div>
    );
  }
}



export default App;
