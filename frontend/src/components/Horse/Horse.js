import React from "react";

import Paper from '@material-ui/core/Paper';

const horse = props => {  
  return (
    <Paper className="horse">
      {props.horse.name}
    </Paper>
  )
}

export default horse;
