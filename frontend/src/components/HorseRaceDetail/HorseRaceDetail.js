import React from "react";

import "./HorseRaceDetail.css"

const horseRaceDetail = props => {
  return (
    <div style={{ fontSize: 13, display: "flex", justifyContent: 'space-between', margin: '0px 5px' }}>
      <div style={{ display: 'flex', width: '10%', justifyContent: 'space-between'}}>
        <div>{props.date.replace(/\s+/g, '')}</div>
        <div>L</div>
        <div>{props.days}</div>
        <div>Hvc{props.details.raceNumber}</div>
        <div>{props.details.distance}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div>23 0</div>
        <div>45 3</div>
        <div>1:18 4</div>
        <div>1 57 4</div>
      </div>

      <div style={{width: '15%'}}>
        {props.details.claiming}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '20px', justifyContent: 'space-between'}}>
          <div>{props.details.startingPosition}</div>
          <div>3</div>
        </div>
        <div style={{ display: 'flex' }}><div>2</div><div style={{ fontSize: '10px', fontWeight: '600' }}>1¼</div></div>
        <div style={{ display: 'flex' }}><div>3</div><div style={{ fontSize: '10px', fontWeight: '600' }}>2½</div></div>
        <div style={{ display: 'flex' }}><div>5</div><div style={{ fontSize: '10px', fontWeight: '600' }}>3¾</div></div>
        <div style={{ display: 'flex' }}><div>1</div><div style={{ fontSize: '10px', fontWeight: '600' }}>1¼</div></div>
      </div>

      <div style={{ display: 'flex', width: '9%', justifyContent: 'space-between'}}>
        <div>
          {props.details.jockey.name}
        </div>
        <div>
          {props.details.jockeyWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '6%', justifyContent: 'space-between'}}>
        <div>
          {props.details.horseMedications}
        </div>
        <div>
          {props.details.horseEquipments}
        </div>
        <div>
          {props.details.horseWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '15%', position: 'relative' }}>
        <div style={{marginRight: '10px'}}>
          {props.details.bet}
        </div>
        <div>
          Positions
        </div>
        <div style={{ position:'absolute', right: '0' }}>
          {props.details.totalHorses}
        </div>
      </div>
    </div>
  )
}

export default horseRaceDetail;
