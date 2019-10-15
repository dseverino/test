import React from "react";

import "./Horse.css"
import HorseRaceDetail from "../HorseRaceDetail/HorseRaceDetail";

import Paper from '@material-ui/core/Paper';

const horse = props => {
  const dateFormmater = new Intl.DateTimeFormat('en-GB', { year: '2-digit', month: 'short', day: '2-digit' });

  const horseRaceDetailsFiltered = props.horse.raceDetails.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0)).filter(detail => {
    return detail.date <= props.dateSelected.toISOString()
  })

  return (
    <Paper style={{ margin: "10px 0px" }} className="horse__card">

      <div style={{ display: "flex" }}>
        <div style={{ margin: "3px 30px" }}>
          <h2>{horseRaceDetailsFiltered[0].startingPosition}</h2>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "12px", display: "flex", width: "100%" }}>
            <div style={{ width: "67%" }}>{horseRaceDetailsFiltered[0].stable.name} (0-0-0-0)</div>
            <div style={{ display: "flex", width: "33%", justifyContent: "space-between" }}>
              <div>{horseRaceDetailsFiltered[0].trainer.name} (0-0-0-0)</div>
              <div>{horseRaceDetailsFiltered[0].claiming}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ fontSize: "12px" }}>Roja, mangas verdes aros rojos</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex" }}>
                <div style={{ fontSize: "19px", width: "33%" }}>
                  <strong>
                    <span style={{ marginRight: "25px" }}>{props.horse.name}
                    </span>
                    <span>
                      ({horseRaceDetailsFiltered[0].horseMedications.join(",")})
                    </span>
                  </strong>
                </div>
                <div><span style={{ fontWeight: 500, marginRight: 8 }}>{horseRaceDetailsFiltered[0].jockeyWeight}</span> <span>{horseRaceDetailsFiltered[0].horseEquipments.join("")}</span></div>
              </div>
              <div style={{ display: "flex", fontSize: 11 }}>
                {props.horse.age}-{props.horse.color}-{props.horse.sex} {props.horse.sire} - {props.horse.dam}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div ><span>{horseRaceDetailsFiltered[0].jockey.name} </span><div>( 0-0-0-0 ) 0.00%</div></div>
              <div>Vida Statistics</div>
            </div>

          </div>

        </div>
      </div>

      <div >
        {
          horseRaceDetailsFiltered.map((detail, index) => {
            const days = horseRaceDetailsFiltered[index + 1] ? (new Date(detail.date) - new Date(horseRaceDetailsFiltered[index + 1].date)) / (1000 * 3600 * 24) : 0            
            return <HorseRaceDetail details={detail} key={index} days={days} date={dateFormmater.format(new Date(detail.date))} />
          })
        }
      </div>


      <div>
        Trabajos

      </div>


    </Paper>
  )
}

export default horse;
