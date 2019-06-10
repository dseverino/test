import React from "react";

import "./HorseItem.css";

const horseItem = props => {    
  return (
    <li className="horse__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>${new Intl.NumberFormat().format(props.price)} - {new Date(props.date).toLocaleDateString()}</h2>
      </div>
      <div>
        {props.creatorId === props.userId ? (
          <p>You are the owner of this horse</p>
        ) : (
          <button onClick={props.onDetails.bind(this, props.horseId)} className="btn">View Details</button>
        )}
      </div>
    </li>
  )
};

export default horseItem;
