import React from "react";

import HorseItem from "./HorseItem/HorseItem";

import "./HorseList.css";

const horseList = props => {  
  const horses = props.horses.map(horse => {
    return <HorseItem
      key={horse._id} 
      name={horse.name} 
      weight={horse.weight}
      birth={props.userId} 
      color={horse.creator._id}
      sex={horse._id} 
      sire={horse.title}
      damn={horse.damn}
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
