import React from "react";

import "./HorseRaceDetail.css"

const horseRaceDetail = props => {
  return (
    <div style={{fontSize: 12}}>
      {props.details.date}{props.details.raceNumber}
      {props.details.distance}
      *******************
      {props.details.claiming}
      {props.details.horseMedications}
      {props.details.horseEquipments}
      {props.details.jockeyWeight}
      {props.details.startingPosition}
      ****************
      {props.details.jockey.name}
      *******************
    </div>
  )
}

export default horseRaceDetail;
