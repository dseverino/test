import React, { Component } from "react";

import AuthContext from "../context/auth-context";

import BookingList from "../components/Bookings/BookingList/BookingList"
import Spinner from "../components/Spinner/Spinner"

class BookingsPage extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    bookings: []
  }

  componentDidMount = () => {
    this.fetchBookings()
  }

  onCancelBookingHandler = (bookingId) => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation { 
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
            description
          }
        }
      `
    }

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.context.token}`
      }
    })
      .then(result => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed")
        }
        return result.json()
      })
      .then(resData => {        
        this.setState(prevState => {
          return {bookings: this.state.bookings.filter(b => b._id !== bookingId), isLoading: false}
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  fetchBookings = () => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query { 
          bookings {
            _id
            createdAt
            updatedAt
            event {
              _id
              title
              date
            }
            user {
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.context.token}`
      }
    })
      .then(result => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed")
        }
        return result.json()
      })
      .then(resData => {        
        this.setState({ bookings: resData.data.bookings, isLoading: false });
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
            <BookingList bookings={this.state.bookings} onCancelBooking={this.onCancelBookingHandler} userId={this.context.userId}></BookingList>
          )}
      </React.Fragment>
    );
  }
}

export default BookingsPage