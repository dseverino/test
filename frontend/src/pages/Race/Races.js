import React, { Component } from "react";

import AuthContext from "../../context/auth-context";

import BookingList from "../../components/Bookings/BookingList/BookingList"
import BookingsChart from "../../components/Bookings/BookingsChart/BookingsChart"
import Spinner from "../../components/Spinner/Spinner"
import BookingsControls from "../../components/Bookings/BookingsControls/BookingsControls"

class BookingsPage extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list'
  }

  componentDidMount = () => {
    this.fetchBookings()
  }

  onCancelBookingHandler = (bookingId) => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CancelBooking ($id: ID!){ 
          cancelBooking(bookingId: $id) {
            _id
            title
            description
          }
        }
      `,
      variables: {
        id: bookingId
      }
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
          return { bookings: this.state.bookings.filter(b => b._id !== bookingId), isLoading: false }
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
              price
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

  changeOutputHandler = outputType => {
    if(outputType === 'list'){
      this.setState({outputType: 'list'})
    }
    else {
      this.setState({outputType: 'chart'})
    }
  }

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControls changeOutput={this.changeOutputHandler} activeOutputType={this.state.outputType}/>
          <div>
            {this.state.outputType === 'list' ? <BookingList bookings={this.state.bookings} onCancelBooking={this.onCancelBookingHandler} userId={this.context.userId} /> : <BookingsChart bookings={this.state.bookings} />}
          </div>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default BookingsPage