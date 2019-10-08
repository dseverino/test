import React from "react";

import "./Horse.css"
import HorseRaceDetail from "../HorseRaceDetail/HorseRaceDetail";

import Paper from '@material-ui/core/Paper';

const horse = props => {
  const dateFormmater = new Intl.DateTimeFormat('en-GB', { year: '2-digit', month: 'short', day: '2-digit' });

  const horseRaceDetailsFiltered = props.horse.raceDetails.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0)).filter(detail => {
    return detail.date <= props.dateSelected.toISOString()
  }
  )

  return (
    <Paper style={{ margin: "10px 0px" }} className="horse__card">
      <div style={{ display: "flex" }}>

        <div style={{ marginRight: "5px" }}>
          <div><h3>{horseRaceDetailsFiltered[0].startingPosition}</h3></div>
          
          <div style={{ fontSize: "13px" }}>
            {horseRaceDetailsFiltered[0].stable.name}
            {horseRaceDetailsFiltered[0].trainer.name}
            {horseRaceDetailsFiltered[0].claiming}
          </div>
          <div style={{display: "flex"}}>
            <div><strong>{props.horse.name} ({horseRaceDetailsFiltered[0].horseMedications.join(",")})</strong></div>
            <div>  {horseRaceDetailsFiltered[0].horseEquipments.join("")}</div>
            <div>{horseRaceDetailsFiltered[0].jockey.name}  {horseRaceDetailsFiltered[0].jockeyWeight}</div>
          </div>

        </div>

        <div style={{ width: "16%" }}>

        </div>

        <div style={{ border: "1px solid red", flexGrow: 2, margin: "1px 2px 1px 10px" }}>
          <div style={{ display: "flex", border: "1px solid blue", flexGrow: 2, fontSize: 12, fontWeight: "600" }}>
            <div style={{ flexGrow: 1 }}>
              {props.horse.age}-{props.horse.color}-{props.horse.sex} {props.horse.sire} - {props.horse.dam}
            </div>
          </div>
          {
            horseRaceDetailsFiltered.map((detail, index) => {
              return <HorseRaceDetail details={detail} key={index} date={dateFormmater.format(new Date(detail.date))} />
            })
          }
        </div>

      </div>
    </Paper>
  )
}

export default horse;
