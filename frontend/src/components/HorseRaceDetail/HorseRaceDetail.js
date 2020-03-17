import React from "react";

import "./HorseRaceDetail.css"

const horseRaceDetail = props => {
  const posObject = props.details.racePositions.positions
  var positions = [];
  if (posObject) {
    positions = Object.keys(posObject).map((key, index) => {      
      if(!posObject[key]){
        return <div key={index}></div>
      }
      return <div key={key}>{posObject[key].name}-{posObject[key].by}</div>
      
    })
  }

  return (
    <div style={{ fontSize: 13, display: "flex", justifyContent: 'space-between', margin: '0px 5px' }}>
      <div style={{ display: 'flex', width: '12%', justifyContent: 'space-between' }}>
        <div style={{ width: '25%' }}>{props.date.replace(/\s+/g, '')}</div>
        <div style={{ width: '5%' }}>L</div>
        <div style={{ width: '11%' }}>{props.days}</div>
        <div style={{ width: '15%' }}>Hvc{props.details.raceNumber}</div>
        <div>{props.details.distance}</div>
        <div style={{ width: '20%' }}>{props.details.finishTime}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div>{props.details.times.quarterMile}</div>
        <div>{props.details.times.halfMile}</div>
        <div>{props.details.times.thirdQuarter}</div>
        <div>{props.details.times.finish}</div>
      </div>

      <div style={{ width: '15%' }}>
        {props.details.claiming}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '20px', justifyContent: 'space-between' }}>
          <div>{props.details.startingPosition}</div>
          <div>{props.details.positions.start}</div>
        </div>
        <div style={{ display: 'flex' }}>
          <div>{props.details.positions.quarterMile}</div>
          <div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.quarterMile}
          </div>
        </div>
        <div style={{ display: 'flex' }}><div>{props.details.positions.halfMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.halfMile}</div></div>
        <div style={{ display: 'flex' }}><div>{props.details.positions.thirdQuarter}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.thirdQuarter}</div></div>
        <div style={{ display: 'flex' }}><div>{props.details.positions.finish}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.finish}</div></div>
      </div>

      <div style={{ display: 'flex', width: '9%', justifyContent: 'space-between' }}>
        <div>
          {props.details.jockey.name}
        </div>
        <div>
          {props.details.jockeyWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '6%', justifyContent: 'space-between' }}>
        <div style={{ width: '20%' }}>
          {props.details.horseMedications}
        </div>
        <div style={{ width: '50%' }}>
          {props.details.horseEquipments}
        </div>
        <div style={{ width: '30%' }}>
          {props.details.horseWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '15%', position: 'relative' }}>
        <div style={{ width: '10%' }}>
          {props.details.bet}
        </div>
        <div className="d-flex" style={{ width: '85%' }}>
          {positions}
        </div>
        <div style={{ width: '3%' }}>
          {props.details.totalHorses}
        </div>
      </div>
    </div>
  )
}

export default horseRaceDetail;
