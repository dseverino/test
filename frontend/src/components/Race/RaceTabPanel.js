import React from "react";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Horse from '../../components/Horse/Horse';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

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

const raceTab = props => {
  const claimings = props.race.claimings.map(claiming => {
    return "Reclamo RD$" + claiming
  })
  return (
    <TabPanel value={props.value} index={props.index}>
      <div>{props.race.distance}. {props.race.procedences} {props.race.horseAge}, {claimings.toString()}. {props.race.spec}</div>
      <div>Premio RD{formatter.format(props.race.purse)}</div>
      <div>
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>

      <Horse style={{ flexGrow: 1 }} />

      <Horse style={{ flexGrow: 1 }} />

    </TabPanel>
  )
}



export default raceTab