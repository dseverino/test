import React from "react"

import "./BookingItem.css";

const bookingItem = props => {  
  return (
    <li className="bookings__item">
      <div className="bookings__item-data">
        {props.title} - {new Date(props.date).toLocaleDateString()}
      </div>
      <div className="bookings__item-actions">
        {props.creator !== props.userId ? (
          <p>You are not the owner of this booking</p>
        ) : (
            <button onClick={props.cancelBooking.bind(this, props.bookingId)} className="btn">Cancel Booking</button>
          )}
      </div>
    </li>
  )
}

export default bookingItem