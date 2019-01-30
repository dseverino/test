import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList"
import Spinner from "../components/Spinner/Spinner";

import AuthContext from "../context/auth-context";

import "../pages/Events.css";

class EventsPage extends Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }

  componentDidMount = () => {
    this.fetchEvents()
  }

  state = {
    creating: false,
    events: [],
    isLoading: false
  }

  startCreateEvent = () => {
    this.setState({ creating: true })
  }

  modalCancelHandler = () => {
    this.setState({ creating: false })
  }

  fetchEvents() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query { 
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
            }
          }
        }
      `
    }

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(result => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed")
        }
        return result.json()
      })
      .then(resData => {
        this.setState({ events: resData.data.events, isLoading: false });
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  modalConfirmHandler = () => {
    const title = this.titleElRef.current.value;
    const price = this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0 || price.trim().length === 0 || date.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    //const event = { title, price, date, description }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
            _id
            title
            description
            price
            date            
          }
        }
      `
    }

    const token = this.context.token

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(result => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed")
        }
        return result.json()
      })
      .then(resData => {
        this.setState((prevState) => {
          return { events: [...prevState.events, resData.data.createEvent] }
        })
        this.modalCancelHandler();
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop></Backdrop>}
        {this.state.creating && (
          <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={this.descriptionElRef} />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button onClick={this.startCreateEvent} className="btn">Create Event</button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
            <EventList events={this.state.events} userId={this.context.userId}></EventList>
          )}
      </React.Fragment>
    );
  }
}

export default EventsPage
