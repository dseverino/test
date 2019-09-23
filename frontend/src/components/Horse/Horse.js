import React from "react";

import "./Horse.css"

import Paper from '@material-ui/core/Paper';

const horse = props => {
  const horseRaceDetailsFiltered = props.horse.raceDetails.filter(detail => detail.date <= props.dateSelected.toISOString() );  
  
  return (
    <Paper style={{ margin: "10px 0px" }} className="horse__card">
      <div style={{ display: "flex" }}>

        <div style={{ marginRight: "5px" }}>
          <h3>{horseRaceDetailsFiltered[0].startingPosition}</h3>
        </div>
        <div style={{width: "16%"}}>
          <strong>{props.horse.name}</strong>
          <div>{horseRaceDetailsFiltered[0].claiming} {horseRaceDetailsFiltered[0].horseMedications.join(",")} {horseRaceDetailsFiltered[0].horseEquipments.join("")}</div>
          <div>{horseRaceDetailsFiltered[0].jockey.name}  {horseRaceDetailsFiltered[0].jockeyWeight}</div>
        </div>

        <div style={{ border: "1px solid red", flexGrow: 2, margin: "1px 2px 1px 10px" }}>
          <div style={{ display: "flex", border: "1px solid blue", flexGrow: 2, fontSize: 12, fontWeight: "600" }}>
            <div style={{flexGrow: 1}}>
              {props.horse.age}-{props.horse.color}-{props.horse.sex} {props.horse.sire} {props.horse.dam}
            </div>
            <div style={{flexGrow: 2}}>
              {horseRaceDetailsFiltered[0].stable.name}
            </div>
            <div>
              {horseRaceDetailsFiltered[0].trainer.name}
            </div>
          </div>
          <div style={{border: "1px solid yellow"}}>
            {/*   CREATE HORSE RACE DETAIL COMPONENT WITH THE FILTERED LIST*/}
            {props.horse.raceDetails[0].date}{props.horse.raceDetails[0].raceNumber}{props.horse.raceDetails[0].distance}*******************{props.horse.raceDetails[0].claiming}{props.horse.raceDetails[0].horseMedications}{props.horse.raceDetails[0].horseEquipments}{props.horse.raceDetails[0].jockeyWeight}{props.horse.raceDetails[0].startingPosition}****************{props.horse.raceDetails[0].jockey.name}*******************
          </div>
          <div style={{border: "1px solid yellow"}}>

          </div>
          <div style={{border: "1px solid yellow"}}>

          </div>
          <div style={{border: "1px solid yellow"}}>

          </div>
          <div style={{border: "1px solid yellow"}}>

          </div>
          <div style={{border: "1px solid yellow"}}>

          </div>
        </div>
      </div>

    </Paper>
  )
}

export default horse;
