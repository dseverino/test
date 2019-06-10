import React from "react";

import HorseItem from "./HorseItem/HorseItem";

import "./HorseList.css";

const horseList = props => {  
  const horses = props.horses.map(horse => {
    return <HorseItem
      key={horse._id} 
      horseId={horse._id}
      name={horse.name} 
      weight={horse.weight}
      birth={horse.birth} 
      color={horse.color}
      sex={horse.sex} 
      sire={horse.sire}
      dam={horse.dam}
      stable={horse.stable}
      onDetails={props.openViewDetails} />
  })

  return (
    <ul className="horses__list">
      {horses}
    </ul>
  )
}

export default horseList;
