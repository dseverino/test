import React from "react";

import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import IconButton from '@material-ui/core/IconButton';
import FastForwardIcon from '@material-ui/icons/FastForward';

import { Lightbox } from 'primereact/lightbox';

import "./HorseRaceDetail.css"
import MouseOverPopover from "../Popover/MouseOverPopover";

const HorseRaceDetail = props => {
  const posObject = props.details.racePositions.positions
  var jockeyLastName = props.details.jockey.name.split(" ");
  jockeyLastName.shift();
  jockeyLastName.join(" ")
  var positions = [];
  if (posObject) {
    positions = Object.keys(posObject.slice(0, 3)).map((key, index) => {
      if (!posObject[key]) {
        return <div key={index}></div>
      }
      return <div key={key}>{posObject[key].name}-{posObject[key].by}</div>

    })
  }

  var getClaimingLabel = (claiming) => {
    var titleList = claiming.split(" ")
    return titleList[0] + " " + titleList[1][0];
  }

  return (
    <div style={{ fontSize: 13, display: "flex", justifyContent: 'space-between', margin: '0px 5px' }}>
      <div style={{ display: 'flex', width: '12%', justifyContent: 'space-between' }}>
        <div style={{ width: '35%' }}>{props.date.replace(/\s+/g, '')}</div>
        <div style={{ width: '5%' }}>L</div>
        <div style={{ width: '10%' }}>{props.days}</div>
        <div style={{ width: '20%' }}>Hvc{props.details.raceNumber}</div>
        <div>{props.details.distance}</div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div>{props.details.times.quarterMile || ""}</div>
        <div>{props.details.times.halfMile}</div>
        <div>{props.details.times.thirdQuarter}</div>
        <div>{props.details.times.finish}</div>
      </div>

      <div style={{ width: '6%' }}>
        {getClaimingLabel(props.details.claiming)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '15%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '20px', justifyContent: 'space-between' }}>
          <div>{props.details.startingPosition}</div>
          <div>{props.details.positions.start}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '80%' }}>
          <div style={{ display: 'flex' }}><div>{props.details.positions.quarterMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.quarterMile}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.positions.halfMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.halfMile}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.positions.thirdQuarter}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.thirdQuarter}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.positions.finish}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.finish}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.finishTime}</div></div>
          {props.details.raceUrl && (
            <React.Fragment>
              <Lightbox target={<IconButton style={{ padding: 0, height: "20px" }} size="small"><VideocamOutlinedIcon /> </IconButton>}>

                <iframe width="853" height="480" title="myframe" src={props.details.raceUrl} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </Lightbox>
              <Lightbox target={<IconButton style={{ padding: 0, height: "20px" }} size="small"><FastForwardIcon /> </IconButton>}>

                <iframe width="853" height="480" title="myframe" src={props.details.finalStraightUrl} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </Lightbox>
            </React.Fragment>

          )


          }
        </div>
        <div>

        </div>
      </div>

      <div style={{ display: 'flex', width: '8%', justifyContent: 'space-between' }}>
        <div>
          {props.details.jockey.name[0] + " " + jockeyLastName}
        </div>
        <div>
          {props.details.jockeyWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '10%', justifyContent: 'space-between' }}>
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

      <div style={{ display: 'flex', width: '25%', position: 'relative' }}>
        <div style={{ width: '10%' }}>
          {props.details.bet}
        </div>
        <div className="d-flex" style={{ width: '85%' }}>
          {positions}
        </div>
        <div>
          <MouseOverPopover posObject={posObject}></MouseOverPopover>
        </div>
        <div style={{ width: '3%' }}>
          {props.details.totalHorses}
        </div>
      </div>
    </div>
  )
}

export default HorseRaceDetail;
