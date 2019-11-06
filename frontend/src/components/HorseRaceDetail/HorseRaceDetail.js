import React from "react";

import "./HorseRaceDetail.css"

const horseRaceDetail = props => {
  return (
    <div style={{ fontSize: 12, display: "flex" }}>
      <div>
        {props.date.replace(/\s+/g, '')} {props.days} Hvc{props.details.raceNumber} {props.details.distance}
      </div>
      <div>
        <span>23 0</span>
        <span>45 3</span>
        <span>1:18 4</span>
        <span>1 57 4</span>
      </div>

      <span>
        {props.details.claiming}
      </span>
      <span>
        <span>{props.details.startingPosition}</span>
        <span>3</span>
        <span>2 1/2</span>
        <span>2 1 1/2</span>
        <span>2 1/2</span>
        <span>1 1/4</span>
      </span>
      <span>
        {props.details.horseMedications}
      </span>
      

      ***********
      <span>
        {props.details.horseWeight}
      </span>

      ***********
      <span>
        
      </span>
      ***********
      <span>
        {props.details.jockey.name}
      </span>
      <span>
        {props.details.jockeyWeight}
      </span>
      <span>
        {props.details.horseEquipments}
      </span>
      <span>
        8/5
      </span>
      <span>
        Positions
      </span>
      <span style={{float: "right"}}>
        {props.details.totalHorses}
      </span>

    </div>
  )
}

export default horseRaceDetail;
