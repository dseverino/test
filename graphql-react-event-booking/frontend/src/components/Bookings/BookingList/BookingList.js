import React from "react";

import "./BookingList.css";

import BookingItem from "./BookingItem/BookingItem"

const bookingList = props => {  
  const bookings = props.bookings.map(booking => {
    return <BookingItem 
        key={booking._id}
        bookingId={booking._id} 
        title={booking.event.title}
        date= {booking.event.date}   
        creator= {booking.user._id}
        cancelBooking={props.onCancelBooking}
        userId={props.userId}/>    
  })

  return (
    <ul className="booking__list">
      {bookings}
    </ul>
  )
}

export default bookingList;
