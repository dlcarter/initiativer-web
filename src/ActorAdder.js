import React, { Component } from 'react';
import { MdAdd } from 'react-icons/lib/md';
import Modal from 'react-modal';
import { default as UUID } from 'uuid/v4';

Modal.setAppElement('#root');

class ActorAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "new": { "id": -1, "name": "", "roll": 0, "total": 0, "initiative": 0 },
      "count": 1,
      modalIsOpen: false
    };
  }

  resetNew = () => {
    this.setState({
      "new": { "id": -1, "name": "", "roll": 0, "total": 0, "initiative": 0 } 
    });
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
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
  
  handleCount = (e) => {
    var num = parseInt(e.target.value, 10);
    if (isNaN(num)) {
      num = 1;
    }
    this.setState({ count: num });
  }
  
  onAdd = (e) => {
    const { addActor } = this.props;

    e.preventDefault();
    var newActor = this.state.new;
    newActor.roll = 0;
    for (var i = 0; i < this.state.count; i++) {
      newActor.id = UUID();
      addActor(newActor);
    }


    this.resetNew();
    this.closeModal();
  }

  render() {
    return (
      <div>
        <button className="btn-small" onClick={this.openModal}><MdAdd /></button>
        <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        contentLabel="New Creature Modal"
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
            <div className="form-group">
              <label htmlFor="count">Count</label>
              <input id="count" type="text" value={this.state.count} onChange={this.handleCount} />
              <button className="btn-small" onClick={this.onChangeCount}>+</button> 
            </div>
            <button className="btn-small" onClick={this.onAdd}>Save</button> <button className="btn-small" onClick={this.closeModal}>Cancel</button>
        </form>
        </Modal>
      </div>
    );
  }
}

export default ActorAdder;