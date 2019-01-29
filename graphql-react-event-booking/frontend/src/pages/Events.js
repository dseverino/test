import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "../pages/Events.css";

class EventsPage extends Component {
  state = {
    creating: false
  }

  startCreateEvent = () => {
    this.setState({ creating: true })
  }

  modalCancelHandler = () => {
    this.setState({ creating: false })
  }

  modalConfirmHandler = () => {
    console.log("submitted!!")
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop></Backdrop>}
        {this.state.creating && (
          <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            <p>Modal Content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button onClick={this.startCreateEvent} className="btn">Create Event</button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage
