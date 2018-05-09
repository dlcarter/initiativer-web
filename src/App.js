import React, { Component } from 'react';
import { MdUndo, MdAdd } from 'react-icons/lib/md';
import Modal from 'react-modal';

import 'papercss/dist/paper.css';
//import logo from './logo.svg';
import './App.css';

import ActorList from './ActorList'

Modal.setAppElement('#root');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "actors": [
        { "id": 0, "name": "Joey", "roll": 0, "total": 0, "initiative": 3, "active": true },
        { "id": 1, "name": "Billy", "roll": 0, "total": 0, "initiative": 4 },
        { "id": 2, "name": "Franky", "roll": 0, "total": 0, "initiative": 5 },
        { "id": 3, "name": "Johnny", "roll": 0, "total": 0, "initiative": 5 },
        { "id": 4, "name": "Aloysius", "roll": 0, "total": 0, "initiative": 5 },
      ],
      "new": { "id": -1, "name": "", "roll": 0, "total": 0, "initiative": 0 },
      "rounds": 0,
      modalIsOpen: false,
    };
  }

  shuffle = () => {
    var actors = this.state.actors;
    var actor = null;
    for (var i = 0; i < actors.length; i++) {
      actor = actors[i];
      actor.roll = this.roll20();
      actor.active = false;
      actor.total = actor.roll + actor.initiative;
    }
    console.log("actors", actors);
    actors.sort(function(a, b) {
      return b.total - a.total;
    });
    actors[0].active = true;
    this.shuffled = true;
    this.setState({rounds: 0, actors: actors});
  }

  roll20 = () => (Math.floor(Math.random() * 19) + 1);

  onAdvance = (e) => {
    if (!this.shuffled) {
      return
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
  };

  undo = () => {
    if (!this.shuffled) {
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
  }

  addActor = (e) => {
    e.preventDefault();
    console.log("new actor", this.state.new);
    var newActor = this.state.new;
    var highestId = 0;
    for (var i = 0; i < this.state.actors.length; i++) {
      if (this.state.actors[i].id > highestId) {
        highestId = this.state.actors[i].id;
      }
    }
    newActor.id = highestId+1;
    var actors = this.state.actors;
    actors.push(newActor);
    this.setState({actors: actors});
    this.closeModal();
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
          <button className="btn-small" onClick={this.shuffle} disabled={this.shuffled}>Roll for initiative!</button>
          <button className="btn-small" onClick={this.onAdvance} disabled={!this.shuffled}>Advance >></button>
          <button className="btn-small" onClick={this.undo} disabled={!this.shuffled}><MdUndo /></button>
        </div>
        <ActorList actors={this.state.actors} onAdvance={this.onAdvance} />
        <div className="row flex-center">
          <button className="btn-small" onClick={this.openModal} disabled={this.shuffled}><MdAdd /></button>
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
        </div>
      </div>
    );
  }
}



export default App;
