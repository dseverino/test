import React, { useState } from "react";

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogActions from '@material-ui/core/DialogActions';
import Input from '@material-ui/core/Input';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

import MaskedInput from 'react-text-mask';

import Horse from '../../components/Horse/Horse';
import ConfirmationDialogRaw from "../Dialog/ConfirmationDialogRaw";
import Spinner from "../../components/Spinner/Spinner";
import Backdrop from "../../components/Backdrop/Backdrop";


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const raceTab = props => {
  const [completed, setCompleted] = useState(props.race.completed)
  const [raceDetails, setraceDetails] = useState({
    times: {
      quarterMile: '.'
    }

  });

  const [horse, setHorse] = useState({})
  const horses = props.race.horses.map(horse => {
    return (
      <Horse key={horse._id} horse={horse} dateSelected={props.programDate} />
    )
  })
  const claimings = props.race.claimings.map(claiming => {
    return "Reclamo RD$" + claiming
  });

  const [open, setOpen] = useState(false);
  const [openRaceDetails, setOpenRaceDetails] = useState(false);
  const [loading, setLoading] = React.useState(false);

  function handleClickListItem() {
    setOpen(true);
  }

  function handleClose(newName) {
    setOpen(false);
  }

  function handleCompleteRace() {
    setLoading(true);
    const requestBody = {
      query: `
        mutation CompleteRace($raceId: ID) {
          completeRace(raceId: $raceId) {
            programId
            event
            distance
            claimings
            procedences
            horseAge
            spec
            purse
          }
        }
      `,
      variables: {
        raceId: props.race._id
      }
    }

    //const token = this.context.token

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        //"Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(result => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed")
        }
        return result.json()
      })
      .then(resData => {
        setLoading(false);
        setCompleted(true);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      })
  }

  function handleCloseRaceDetails() {

  }
  function handleOpenRaceDetails() {
    setOpenRaceDetails(true)
  }
  function handleHorseChange(e) {
    console.log(e.target.value)
  }

  function handleChangeQuater() {

  }
  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/[2-3]/, /\d/, '.', /[0-4]/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }

  return (
    <TabPanel value={props.value} index={props.index}>
      <div>{props.race.distance}. {props.race.procedences} {props.race.horseAge}, {claimings.toString()}. {props.race.spec}</div>

      <div>Premio RD{formatter.format(props.race.purse)}</div>


      <div>
        <Button disabled={completed} color="primary" onClick={handleClickListItem} aria-controls="add-horse">
          Add Horse
          <AddIcon />
        </Button>

        <Button disabled={completed} color="primary" onClick={handleCompleteRace} aria-controls="add-horse">
          Complete Race
          <CheckIcon />
        </Button>
        <Button disabled={!completed} color="primary" onClick={handleOpenRaceDetails} aria-controls="add-horse">
          Add Race Details
        </Button>
      </div>


      {
        horses
      }

      <ConfirmationDialogRaw
        id="add-horse"
        open={open}
        keepMounted
        onClose={handleClose}
        jockeys={props.jockeys}
        stables={props.stables}
        trainers={props.trainers}
        date={props.programDate}
        claimings={props.race.claimings}
        horsesqty={props.race.horses.length + 1}
        racenumber={props.race.event}
        distance={props.race.distance}
        onHorseAdded={props.horseaddedtorace}
        raceId={props.race._id}
        index={props.index}
      />

      <Dialog
        open={openRaceDetails}
        keepMounted
        onClose={handleCloseRaceDetails}>
        <DialogTitle >Race Details</DialogTitle>
        <DialogContent>
          <form style={{ display: "flex", flexDirection: "column", margin: "auto", width: 'fit-content' }}>
            <FormControl style={{ marginTop: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">Select Horse</InputLabel>
              <Select
                value={horse}
                onChange={handleHorseChange}
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                {
                  props.race.horses.map(horse => {
                    return <MenuItem key={horse._id} value={horse.raceDetails[0]._id}>{horse.name}</MenuItem>
                  })
                }
              </Select>

            </FormControl>
            <FormControl>
              <InputLabel htmlFor="formatted-text-mask-input">1/4</InputLabel>
              <Input
                value={raceDetails.times.quarterMile}
                onChange={handleChangeQuater('textmask')}
                id="formatted-text-mask-input"
                inputComponent={TextMaskCustom}
              />
            </FormControl>

          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRaceDetails(false)} >
            Close
          </Button>
          <Button color="primary">
            Save
          </Button>
        </DialogActions>

      </Dialog>


      {/* Loader and Spinner*/}
      {loading && <React.Fragment>
        <Spinner />
        <Backdrop />
      </React.Fragment>
      }

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