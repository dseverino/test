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

  componentWillUnmount() {
    this.isActive = false;
  }
  

  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  }
  isActive = true;

  startCreateEvent = () => {
    this.setState({ creating: true })
  }

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null })
  }

  onDetailsHandler = (eventId) => {    
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(event => event._id === eventId)
      return { selectedEvent: selectedEvent }
    })
  }

  bookEventHandler = () => {
    if(!this.context.token) {
      this.setState({selectedEvent: null})
      return;
    }
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${this.state.selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `
    }    

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Authorization": `Bearer ${this.context.token}`,
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
        this.setState({selectedEvent: null})   
      })
      .catch(error => {
        console.log(error);
      })
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
        if(this.isActive){
          this.setState({ events: resData.data.events, isLoading: false });
        }        
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
        {(this.state.creating || this.state.selectedEvent) && <Backdrop></Backdrop>}
        {this.state.creating && (
          <Modal title="Add Event" confirmTitle="Confirm" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
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
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            confirmTitle={this.context.token ? "Book" : "Confirm"}
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>${Intl.NumberFormat().format(this.state.selectedEvent.price)} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
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
            <EventList openViewDetails={this.onDetailsHandler} events={this.state.events} userId={this.context.userId}></EventList>
          )}
      </React.Fragment>
    );
  }
}

export default EventsPage
