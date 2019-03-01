import React from "react";

import EventItem from "./EventItem/EventItem";

import "./EventList.css";

const eventList = props => {  
  const events = props.events.map(event => {
    return <EventItem
      key={event._id} 
      price={event.price} 
      date={event.date}
      userId={props.userId} 
      creatorId={event.creator._id}
      eventId={event._id} 
      title={event.title}
      onDetails={props.openViewDetails} />
  })

  return (
    <ul className="events__list">
      {events}
    </ul>
  )
}

export default eventList;
