import React from "react";

import "./EventItem.css";

const eventItem = props => {    
  return (
    <li className="event__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>${new Intl.NumberFormat().format(props.price)} - {new Date(props.date).toLocaleDateString()}</h2>
      </div>
      <div>
        {props.creatorId === props.userId ? (
          <p>You are the owner of this event</p>
        ) : (
          <button onClick={props.onDetails.bind(this, props.eventId)} className="btn">View Details</button>
        )}
      </div>
    </li>
  )
};

export default eventItem;
