import React, { useState } from "react";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Horse from '../../components/Horse/Horse';
import ConfirmationDialogRaw from "../Dialog/ConfirmationDialogRaw";


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const raceTab = props => {  
  const horses = props.race.horses.map(horse => {
    return (
      <Horse key={horse._id} horse={horse} style={{ flexGrow: 1 }} />
    )
  })
  const claimings = props.race.claimings.map(claiming => {
    return "Reclamo RD$" + claiming
  })

  const [open, setOpen] = React.useState(false);  

  function handleClickListItem() {
    setOpen(true);
  }

  function handleClose(newName) {
    setOpen(false);
  }

  return (
    <TabPanel value={props.value} index={props.index}>
      <div>{props.race.distance}. {props.race.procedences} {props.race.horseAge}, {claimings.toString()}. {props.race.spec}</div>
      <span>

      </span>
      <div>Premio RD{formatter.format(props.race.purse)}</div>
      <div>
        <Button color="primary" onClick={handleClickListItem} aria-controls="add-horse">
          Add Horse
        </Button>
      </div>

      {horses}

      <ConfirmationDialogRaw
        id="add-horse"
        open={open}
        keepMounted
        onClose={handleClose}
        jockeys={props.jockeys}
        date={props.programDate}
      />

    </TabPanel>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}


export default raceTab