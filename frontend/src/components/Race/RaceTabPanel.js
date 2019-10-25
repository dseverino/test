import React, { useState, useEffect } from "react";

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
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

  const { times } = props;

  const horseRaceDetailsIds = props.race.horses.map(horse => {
    let detail = horse.raceDetails.find(detail => props.programDate.toISOString() === detail.date);
    
    return {
      name: horse.name,
      id: detail._id,
      ...detail
    }
  });
  const [values, setValues] = React.useState({
    E: true,
    F: true,
    G: false,
    Gs: false,
    LA: false,
    B: true,
    L: false
  });

  const [completed, setCompleted] = useState(props.race.completed)

  const [raceDetails, setraceDetails] = useState({
    times: times || {
      quarterMile: "23.4",
      halfMile: '47.4',
      finish: '1:14.3'
    },
    totalHorses: props.race.horses.length,
    hasRaceDetails: true
  });
  const [horseRaceDetail, setHorseRaceDetail] = useState({
    horseEquipments: [""],
    horseMedications: [""],
  })

  const [selectedHorse, setSelectedHorse] = useState("")
  const [selectedRetiredHorses, setSelectedRetiredHorses] = useState([]);

  useEffect(() => {
    setraceDetails({ ...raceDetails, totalHorses: props.race.horses.length - selectedRetiredHorses.length })
  }, [selectedRetiredHorses])

  const horses = props.race.horses.map(horse => {
    return (
      <Horse key={horse._id} horse={horse} dateSelected={props.programDate} />
    )
  });
  const claimings = props.race.claimings.map(claiming => {
    return "Reclamo RD$" + claiming
  });

  const [open, setOpen] = useState(false);
  const [openRaceDetails, setOpenRaceDetails] = useState(false);
  const [openHorseRaceDetails, setOpenHorseRaceDetails] = useState(false);
  const [loading, setLoading] = React.useState(false);

  function handleClickListItem() {
    setOpen(true);
  }

  function handleClose(newName) {
    setOpen(false);
  }

  function handleCloseRace() {
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
  function handleCloseHorseRaceDetails() {
    setOpenHorseRaceDetails(false);
  }
  function handleOpenRaceDetails() {
    setOpenRaceDetails(true);
  }
  function handleOpenHorseRaceDetails() {
    setOpenHorseRaceDetails(true);
  }
  function handleRetirementChange(e) {
    setSelectedRetiredHorses(e.target.value);
  }
  function handleHorseChange(e) {
    setSelectedHorse(e.target.value)
    console.log(horseRaceDetailsIds)
  }

  const handleChangeQuater = name => event => {
    var times = raceDetails.times;
    if (name === 'quarter') {
      times.quarterMile = event.target.value + '.' + times.quarterMile.split('.')[1]
    }
    else {
      times.quarterMile = times.quarterMile.split('.')[0] + '.' + event.target.value
    }
    setraceDetails({ ...raceDetails, times: times })
  }
  const handleChangeHalfMile = name => event => {
    var times = raceDetails.times;
    if (name === 'halfMile') {
      times.halfMile = event.target.value + '.' + times.halfMile.split('.')[1]
    }
    else {
      times.halfMile = times.halfMile.split('.')[0] + '.' + event.target.value
    }
    setraceDetails({ ...raceDetails, times: times })
  }

  const handleChangeFinish = name => event => {
    var times = raceDetails.times;
    if (name === 'finish') {
      times.finish = event.target.value + '.' + times.finish.split('.')[1]
    }
    else {
      times.finish = times.finish.split('.')[0] + '.' + event.target.value
    }
    setraceDetails({ ...raceDetails, times: times })
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

  function saveRaceDetailsHandler() {

    props.loading(true)

    const requestBody = {
      query: `
        mutation UpdateRaceDetails($raceId: ID, $raceDetails: RaceDetailsInput){
          updateRaceDetails(raceId: $raceId, raceDetails: $raceDetails){
            times{
              quarterMile
              finish
            }
            totalHorses
          }  
        }          
      `,
      variables: {
        raceId: props.race._id,
        raceDetails: raceDetails
      }
    }

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
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
        props.loading(false);
        props.hasRaceDetails(props.index);
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }

  function saveHorseRaceDetailsHandler() {

  }
  const onEquipMedicationChange = (name, col) => event => {
    if (event.target.checked) {
      horseRaceDetail[col].push(name);
      setValues({ ...values, [name]: true });
    }
    else {
      horseRaceDetail[col].splice(horseRaceDetail[col].indexOf(name), 1);
      setValues({ ...values, [name]: false });
    }
  }

  const ITEM_HEIGHT = 50;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <React.Fragment>


      <TabPanel value={props.value} index={props.index}>
        <div>{props.race.distance}. {props.race.procedences} {props.race.horseAge}, {claimings.toString()}. {props.race.spec}</div>

        <div>Premio RD{formatter.format(props.race.purse)}</div>


        <div>
          <Button disabled={completed} color="primary" onClick={handleClickListItem} >
            Add Horse
          <AddIcon />
          </Button>
          <Button disabled={completed} color="primary" onClick={handleCloseRace} >
            Close Race
          <CheckIcon />
          </Button>
          <Button disabled={!completed || props.race.hasRaceDetails} color="primary" onClick={handleOpenRaceDetails} >
            Add Race Details
          </Button>
          <Button disabled={!props.race.hasRaceDetails} color="primary" onClick={handleOpenHorseRaceDetails} >
            Add Horse Race Details
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



        {/* RACE DETAILS DIALOG*/}
        <Dialog
          open={openRaceDetails}
          keepMounted
          onClose={handleCloseRaceDetails}>
          <DialogTitle >Race Details</DialogTitle>
          <DialogContent>
            <form style={{ display: "flex", flexDirection: "column", margin: "auto", width: 'fit-content' }}>
              <FormControl style={{ marginTop: 2, minWidth: 200 }}>
                <InputLabel htmlFor="select-multiple-checkbox">Select Retired Horses</InputLabel>
                <Select
                  multiple
                  value={selectedRetiredHorses}
                  onChange={handleRetirementChange}
                  input={<Input id="select-multiple-checkbox" />}
                  renderValue={selected => (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map(value => (
                        <Chip key={value} label={horseRaceDetailsIds.find(detail => detail.id === value).name} style={{ display: 'flex', flexWrap: 'wrap' }} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {
                    horseRaceDetailsIds.map(raceDetail => (
                      <MenuItem key={raceDetail.id} value={raceDetail.id}>
                        <Checkbox checked={selectedRetiredHorses.indexOf(raceDetail.id) > -1} />
                        <ListItemText primary={raceDetail.name} />
                      </MenuItem>
                    ))
                  }
                </Select>

              </FormControl>
              <div>

                <InputLabel htmlFor="formatted-text-mask-input">1/4</InputLabel>
                <Select
                  value={raceDetails.times.quarterMile.split('.')[0]}
                  onChange={handleChangeQuater('quarter')}
                >
                  <MenuItem value={22}>22</MenuItem>
                  <MenuItem value={23}>23</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={26}>26</MenuItem>
                  <MenuItem value={27}>27</MenuItem>
                </Select>

                <Select
                  value={raceDetails.times.quarterMile.split('.')[1]}
                  onChange={handleChangeQuater('quarterFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>

              <div>

                <InputLabel htmlFor="formatted-text-mask-input">1/2</InputLabel>
                <Select
                  value={raceDetails.times.halfMile.split('.')[0]}
                  onChange={handleChangeHalfMile('halfMile')}
                >
                  <MenuItem value={'45'}>45</MenuItem>
                  <MenuItem value={'46'}>46</MenuItem>
                  <MenuItem value={'47'}>47</MenuItem>
                  <MenuItem value={'48'}>48</MenuItem>
                  <MenuItem value={'49'}>49</MenuItem>
                  <MenuItem value={'50'}>50</MenuItem>
                </Select>

                <Select
                  value={raceDetails.times.halfMile.split('.')[1]}
                  onChange={handleChangeHalfMile('halfMileFraction')}
                >
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>

              <div>
                <InputLabel htmlFor="formatted-text-mask-input">Finish</InputLabel>
                <Select
                  value={raceDetails.times.finish.split('.')[0]}
                  onChange={handleChangeFinish('finish')}
                >
                  <MenuItem value={'1:14'}>1:14</MenuItem>
                  <MenuItem value={23}>23</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={26}>26</MenuItem>
                  <MenuItem value={27}>27</MenuItem>
                </Select>

                <Select
                  value={raceDetails.times.finish.split('.')[1]}
                  onChange={handleChangeFinish('finishFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>
            </form>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRaceDetails(false)} >
              Close
          </Button>
            <Button color="primary" onClick={saveRaceDetailsHandler}>
              Save
          </Button>
          </DialogActions>

        </Dialog>
        {/* RACE DETAILS DIALOG ENDING*/}




        {/* HORSE RACE DETAILS DIALOG*/}
        <Dialog
          open={openHorseRaceDetails}
          keepMounted
          onClose={handleCloseHorseRaceDetails}>
          <DialogTitle >Race Details</DialogTitle>
          <DialogContent>
            <form style={{ display: "flex", flexDirection: "column", margin: "auto", width: 'fit-content' }}>
              <FormControl style={{ marginTop: 2, minWidth: 120 }}>
                <InputLabel htmlFor="max-width">Select Horse</InputLabel>
                <Select
                  value={selectedHorse}
                  onChange={handleHorseChange}
                  inputProps={{
                    name: 'max-width',
                    id: 'max-width',
                  }}
                >
                  {
                    props.race.horses.map(horse => {
                      const value = horse.raceDetails.find(detail => props.programDate.toISOString() === detail.date);
                      return <MenuItem key={horse._id} value={value._id}>{horse.name}</MenuItem>
                    })
                  }
                </Select>

              </FormControl>
              {
                selectedHorse &&
                <React.Fragment>
                  <FormControl>
                    <InputLabel htmlFor="formatted-text-mask-input">Finish</InputLabel>
                    <Input
                      value={raceDetails.times.finish}
                      onChange={handleChangeQuater('textmask')}
                      id="formatted-text-mask-input"
                      inputComponent={TextMaskCustom}
                    />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="formatted-text-mask-input">Total Horses</InputLabel>
                    <Input disabled={true} value={raceDetails.totalHorses} />
                  </FormControl>
                  <div>
                    <FormLabel component="legend">Horse Equipments</FormLabel>
                    <FormGroup style={{ flexDirection: "row" }}>
                      <FormControlLabel
                        control={<Checkbox checked={values.E} onChange={onEquipMedicationChange("E", "horseEquipments")} value="E" />}
                        label="E"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={values.F} onChange={onEquipMedicationChange("F", "horseEquipments")} value="F" />}
                        label="F"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={values.G} onChange={onEquipMedicationChange("G", "horseEquipments")} value="G" />}
                        label="G"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={values.Gs} onChange={onEquipMedicationChange("Gs", "horseEquipments")} value="Gs" />}
                        label="Gs"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={values.LA} onChange={onEquipMedicationChange("LA", "horseEquipments")} value="LA" />}
                        label="LA"
                      />
                    </FormGroup>
                  </div>
                  <div>
                    <FormLabel component="legend">Horse Medications</FormLabel>
                    <FormGroup style={{ flexDirection: "row" }}>
                      <FormControlLabel
                        control={<Checkbox checked={values.L} onChange={onEquipMedicationChange("L", "horseMedications")} value="L" />}
                        label="L"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={values.B} onChange={onEquipMedicationChange("B", "horseMedications")} value="B" />}
                        label="B"
                      />
                    </FormGroup>
                  </div>
                </React.Fragment>
              }
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHorseRaceDetails(false)} >
              Close
            </Button>
            <Button color="primary" onClick={saveHorseRaceDetailsHandler}>
              Save
            </Button>
          </DialogActions>

        </Dialog>
        {/* HORSE RACE DETAILS DIALOG ENDING*/}

      </TabPanel>


      {/* Loader and Spinner*/}
      {
        loading &&
        <React.Fragment>
          <Backdrop />
          <Spinner />
        </React.Fragment>
      }
    </React.Fragment>
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