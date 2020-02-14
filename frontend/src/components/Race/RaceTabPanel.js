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
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputTextarea } from 'primereact/inputtextarea';

import { Dropdown } from "primereact/dropdown";

import Horse from '../../components/Horse/Horse';
import ConfirmationDialogRaw from "../Dialog/ConfirmationDialogRaw";
import Spinner from "../../components/Spinner/Spinner";
import Backdrop from "../../components/Backdrop/Backdrop";
import MaskedInput from 'react-text-mask';


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const raceTab = props => {

  const timesByDistance = {
    1100: "1:05.0",
    1200: "1:09.0",
    1300: "1:15.0",
    1400: "1:21.0",
    1700: "1:41.0",
    1800: "1:47.0",
    1900: "1:54.0",
    2000: "1:59.0"
  };
  const positions = [...Array(props.race.totalHorses).keys()].map(el => ++el)
  const mileTimes = ["1:35", "1:36", "1:37", "1:38", "1:39", "1:40", "1:41", "1:42", "1:43", "1:44", "1:45"];
  const bettingList = ["1/9", "1/5", "2/5", "1/2", "3/5", "4/5", "1/1", "6/5", "7/5", "3/2", "8/5", "9/5", "2/1", "5/2", "3/1", "7/2", "4/1", "9/2"].concat([...Array(100).keys()].filter(el => el > 4).map(el => `${el}/1`))

  const horseEquipments = ["E", "F", "G", "Gs", "LA"];

  const jockeys = props.jockeys.map(jockey => {
    return { label: jockey.name, value: jockey._id }
  });

  const stables = props.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  });

  const horseRaceDetailsIds = props.race.horses.map(horse => {
    let detail = horse.raceDetails.find(detail => props.programDate.toISOString() === detail.date);

    return {
      ...detail,
      name: horse.name,
      horseId: horse._id
    }
  });

  const [completed, setCompleted] = useState(props.race.completed)

  const [timeLeader, setTimeLeader] = useState({
    quarterMile: "23.0",
    halfMile: '47.0',
    thirdQuarter: '1:12.0',
    mile: "1:35.0",
    finish: '0:57.0'
  });

  const [raceDetails, setRaceDetails] = useState({
    times: {
      quarterMile: "23.0",
      halfMile: '47.0',
      finish: '0:57.0'
    },
    totalHorses: props.race.horses.length,
    hasRaceDetails: true,
    trackCondition: "L"
  });

  const [horseRaceDetail, setHorseRaceDetail] = useState({
    horseEquipments: [""],
    horseMedications: [""],
    jockey: '',
    jockeyWeight: 0,
    jockeyChanged: false,
    totalHorses: props.race.totalHorses || 0,
    claimed: false,
    confirmed: false,
    positions: {
      start: 0,
      quarterMile: 0,
      halfMile: 0,
      thirdQuarter: 0,
      mile: 0,
      finish: 0
    }
  });
  const [selectedHorse, setSelectedHorse] = useState({ _id: "", retired: false })

  useEffect(() => {
    if (selectedHorse.name) {
      setHorseRaceDetail({ ...selectedHorse, finishTime: selectedHorse.times.finish, jockey: selectedHorse.jockey._id, trainer: selectedHorse.trainer._id, stable: selectedHorse.stable._id, totalHorses: props.race.totalHorses });
    }
  }, [selectedHorse, selectedHorse.name])


  const [selectedRetiredHorses, setSelectedRetiredHorses] = useState([]);

  useEffect(() => {
    setRaceDetails({ ...raceDetails, totalHorses: props.race.horses.length - selectedRetiredHorses.length })
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
    setOpenRaceDetails(false)
  }

  function handleCloseHorseRaceDetails() {
    setOpenHorseRaceDetails(false);
    setSelectedHorse({ _id: "", retired: false });
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
    const horseRaceDetailSelected = horseRaceDetailsIds.find((el) => el._id === e.target.value);
    setSelectedHorse({ ...horseRaceDetailSelected, retired: horseRaceDetailSelected.retired || false, claimedBy: null, trackCondition: props.race.trackCondition, times: props.race.times, finishTime: props.race.times.finish, claimed: false });
  }

  useEffect(() => {
    if (openRaceDetails) {
      var times = raceDetails.times;
      if (props.race.distance > 1600) {
        times.thirdQuarter = "1:12.0"
        times.mile = "1:35.0"
        times.finish = timesByDistance[props.race.distance]
        setTimeLeader({ ...times });
        setRaceDetails({ ...raceDetails, times: times })
      }
      else if (props.race.distance > 1200) {
        times.thirdQuarter = "1:12.0"
        times.finish = timesByDistance[props.race.distance]
        setTimeLeader({ ...timeLeader, ...times });
        setRaceDetails({ ...raceDetails, times: times })
      }
    }
  }, [openRaceDetails])

  const handleChangeQuater = name => event => {
    var times = raceDetails.times;
    if (name === 'quarter') {
      times.quarterMile = event.target.value + '.' + times.quarterMile.split('.')[1]
    }
    else {
      times.quarterMile = times.quarterMile.split('.')[0] + '.' + event.target.value
    }

    setRaceDetails({ ...raceDetails, times: times });
    setTimeLeader({ ...timeLeader, quarterMile: times.quarterMile });

  }

  const handleChangeHalfMile = name => event => {
    var times = raceDetails.times;
    if (name === 'halfMile') {
      times.halfMile = event.target.value + '.' + times.halfMile.split('.')[1]
    }
    else {
      times.halfMile = times.halfMile.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times })
    setTimeLeader({ ...timeLeader, halfMile: times.halfMile });
  }

  const handleChangeThirdQuarter = name => event => {
    var times = raceDetails.times;
    if (name === 'thirdQuarter') {
      times.thirdQuarter = event.target.value + '.' + times.thirdQuarter.split('.')[1] || 0
    }
    else {
      times.thirdQuarter = times.thirdQuarter.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times });
    setTimeLeader({ ...timeLeader, thirdQuarter: times.thirdQuarter });
  }

  const handleChangeMile = name => event => {
    var times = raceDetails.times;
    if (name === 'mile') {
      times.mile = event.target.value + '.' + times.mile.split('.')[1]
    }
    else {
      times.mile = times.mile.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times })
    setTimeLeader({ ...timeLeader, mile: times.mile });
  }

  const handleChangeFinish = name => event => {
    var times = raceDetails.times;

    if (name === 'finishMinutes') {
      times.finish = event.target.value + ':' + times.finish.split(':')[1]
    }
    else if (name === 'finishSeconds') {
      times.finish = times.finish.split(":")[0] + ":" + event.target.value + '.' + times.finish.split('.')[1]
    }
    else {
      times.finish = times.finish.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times })
    setTimeLeader({ ...timeLeader, finish: times.finish });
  }

  /*const handleFinishTime = name => e => {
    if (name === "finishTime") {
      setHorseRaceDetail({ ...horseRaceDetail, finishTime: e.target.value + ":" + horseRaceDetail.finishTime.split(".")[1] });
    }
    else {
      setHorseRaceDetail({ ...horseRaceDetail, finishTime: horseRaceDetail.finishTime.split(".")[0] + "." + e.target.value });
    }
  }*/

  /*function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/[0-2]/, ':', /[0-5]/, /\d/, '.', /[0-4]/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }*/

  function saveRaceDetailsHandler() {

    props.loading(true)

    const requestBody = {
      query: `
        mutation UpdateRaceDetails($raceId: ID, $raceDetails: RaceDetailsInput, $retiredHorses: [ID]){
          updateRaceDetails(raceId: $raceId, raceDetails: $raceDetails, retiredHorses: $retiredHorses){
            times{              
              quarterMile
              halfMile
              finish
            }
            trackCondition
            totalHorses
          }
        }          
      `,
      variables: {
        raceId: props.race._id,
        raceDetails: raceDetails,
        retiredHorses: selectedRetiredHorses
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
        setOpenRaceDetails(false)
        props.loadProgramRaces();
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }

  function saveHorseRaceDetailsHandler() {
    props.loading(true)
    if (horseRaceDetail.claimed && horseRaceDetail.claimedBy === selectedHorse.stable._id) {
      horseRaceDetail.claimed = false
      horseRaceDetail.claimedBy = ''
    }
    delete horseRaceDetail.name
    delete horseRaceDetail._id

    const requestBody = {
      query: `
        mutation UpdateHorseRaceDetail($raceDetailId: ID, $raceDetails: HorseRaceDetailInput){
          updateHorseRaceDetail(raceDetailId: $raceDetailId, raceDetails: $raceDetails){
            times{              
              quarterMile
              halfMile
              finish
            }
            trackCondition
            totalHorses
          }
        }          
      `,
      variables: {
        raceDetailId: selectedHorse._id,
        raceDetails: horseRaceDetail
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
        setOpenHorseRaceDetails(false)
        props.loadProgramRaces();
      })
      .catch(error => {
        console.log(error)
        props.loading(false);
      })
  }

  function onJockeyChange(e) {
    setHorseRaceDetail({ ...horseRaceDetail, "jockey": e.value, jockeyChanged: selectedHorse.jockey._id !== e.target.value })
  }

  const onEquipMedicationChange = (name, col) => event => {
    var ar = horseRaceDetail[col];
    if (event.target.checked) {
      ar.push(name);
      setHorseRaceDetail({ ...horseRaceDetail, [col]: ar })
    }
    else {
      ar.splice(horseRaceDetail[col].indexOf(name), 1)
      setHorseRaceDetail({ ...horseRaceDetail, [col]: ar })
    }
  }
  const onStableSelection = e => {
    if (e.target.value === selectedHorse.stable._id) {
      setHorseRaceDetail({ ...horseRaceDetail, claimed: false, claimedBy: '' })
    }
    else {
      setHorseRaceDetail({ ...horseRaceDetail, claimedBy: e.target.value })
    }
  }

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/[0-2]/, ':', /[0-5]/, /[0-9]/, '.', /[0-4]/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
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
        disableBackdropClick
        disableEscapeKeyDown
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
                      <Chip key={value} label={horseRaceDetailsIds.find(detail => detail._id === value).name} style={{ display: 'flex', flexWrap: 'wrap' }} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {
                  horseRaceDetailsIds.map(raceDetail => (
                    <MenuItem key={raceDetail._id} value={raceDetail._id}>
                      <Checkbox checked={selectedRetiredHorses.indexOf(raceDetail._id) > -1} />
                      <ListItemText primary={raceDetail.name} />
                    </MenuItem>
                  ))
                }
              </Select>

            </FormControl>
            <div>

              <InputLabel htmlFor="formatted-text-mask-input">Track Condition</InputLabel>
              <Select
                value={raceDetails.trackCondition}
                onChange={(e) => setRaceDetails({ ...raceDetails, trackCondition: e.target.value })}
              >
                <MenuItem value={"L"}>L</MenuItem>
                <MenuItem value={"F"}>F</MenuItem>
                <MenuItem value={"H"}>H</MenuItem>
              </Select>

            </div>

            <div>

              <InputLabel htmlFor="formatted-text-mask-input">1/4</InputLabel>
              <Select
                value={timeLeader.quarterMile.split('.')[0]}
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
                value={timeLeader.quarterMile.split('.')[1]}
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
                value={timeLeader.halfMile.split('.')[0]}
                onChange={handleChangeHalfMile('halfMile')}
                disabled={!raceDetails.times.quarterMile}
              >
                <MenuItem value={'45'}>45</MenuItem>
                <MenuItem value={'46'}>46</MenuItem>
                <MenuItem value={'47'}>47</MenuItem>
                <MenuItem value={'48'}>48</MenuItem>
                <MenuItem value={'49'}>49</MenuItem>
                <MenuItem value={'50'}>50</MenuItem>
              </Select>

              <Select
                value={timeLeader.halfMile.split('.')[1]}
                onChange={handleChangeHalfMile('halfMileFraction')}
                disabled={!raceDetails.times.quarterMile}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>

            </div>

            {
              props.race.distance > 1200 &&
              <div>

                <InputLabel htmlFor="formatted-text-mask-input">3/4</InputLabel>
                <Select
                  value={timeLeader.thirdQuarter.split('.')[0]}
                  onChange={handleChangeThirdQuarter('thirdQuarter')}
                >
                  <MenuItem value={'1:09'}>1:09</MenuItem>
                  <MenuItem value={'1:10'}>1:10</MenuItem>
                  <MenuItem value={'1:11'}>1:11</MenuItem>
                  <MenuItem value={'1:12'}>1:12</MenuItem>
                  <MenuItem value={'1:13'}>1:13</MenuItem>
                  <MenuItem value={'1:14'}>1:14</MenuItem>
                  <MenuItem value={'1:15'}>1:15</MenuItem>
                  <MenuItem value={'1:16'}>1:16</MenuItem>
                  <MenuItem value={'1:17'}>1:17</MenuItem>
                </Select>

                <Select
                  value={timeLeader.thirdQuarter.split('.')[1]}
                  onChange={handleChangeThirdQuarter('halfMileFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>
            }

            {
              props.race.distance > 1400 &&
              <div>

                <InputLabel htmlFor="formatted-text-mask-input">mile</InputLabel>
                <Select
                  value={timeLeader.mile.split('.')[0]}
                  onChange={handleChangeMile('mile')}
                >
                  {
                    mileTimes.map(mil => {
                      return <MenuItem key={mil} value={mil}>{mil}</MenuItem>
                    })
                  }
                </Select>

                <Select
                  value={timeLeader.mile.split('.')[1]}
                  onChange={handleChangeMile('mileFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>
            }


            <div style={{ display: "flex", alignItems: "baseline" }}>
              <FormControl style={{ margin: 1, minWidth: 40 }}>
                <InputLabel htmlFor="formatted-text-mask-input">Finish</InputLabel>
                <Select
                  value={timeLeader.finish.split(':')[0]}
                  onChange={handleChangeFinish('finishMinutes')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                </Select>
              </FormControl>


              <div>:</div>
              <FormControl style={{ margin: 1, width: 32 }}>
                <TextField
                  value={timeLeader.finish.split(":")[1].split(".")[0]}
                  onChange={handleChangeFinish('finishSeconds')}
                  onFocus={(e) => e.target.select()}
                  style={{ width: 37 }}
                  inputProps={{ 'aria-label': 'bare' }}
                />
              </FormControl>
              <div>.</div>
              <FormControl style={{ margin: 1, minWidth: 40 }}>
                <Select
                  value={timeLeader.finish.split('.')[1]}
                  onChange={handleChangeFinish('finishFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </div>
          </form>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRaceDetails} >
            Close
          </Button>
          <Button color="primary" onClick={saveRaceDetailsHandler}>
            Save
          </Button>
        </DialogActions>

      </Dialog>
      {/* RACE DETAILS DIALOG ENDING*/}




      {/* HORSE RACE DETAILS DIALOG START*/}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openHorseRaceDetails}
        onClose={handleCloseHorseRaceDetails}
        maxWidth='lg'
      >
        <DialogTitle >Horse Race Details</DialogTitle>
        <DialogContent>
          <form style={{ display: "flex", flexDirection: "column", margin: "auto", width: 'fit-content' }}>
            <FormControl style={{ marginTop: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">Select Horse</InputLabel>
              <Select
                value={selectedHorse._id}
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
              selectedHorse.name &&
              <React.Fragment>
                <FormControlLabel
                  control={<Checkbox checked={selectedHorse.retired} disabled={true} />}
                  label="Retired"
                />



                <div style={{ display: 'flex' }}>
                  <div style={{width: '50%'}}>
                    <FormControl>
                      <label>Jockey</label>
                      <Dropdown disabled={selectedHorse.retired} options={jockeys} filter={true} value={horseRaceDetail.jockey} onChange={onJockeyChange} />
                    </FormControl>
                    <div>
                      <TextField id="jockeyweight" disabled={selectedHorse.retired}
                        label="Jockey Weight" type="number" onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockeyWeight": Number(e.target.value) })} keyfilter="pint" value={horseRaceDetail.jockeyWeight} margin="normal" variant="outlined" />
                    </div>

                    <div>
                      <FormControlLabel
                        control={<Checkbox checked={horseRaceDetail.claimed} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, claimed: e.target.checked })} value="true" />}
                        label="Claimed"
                        labelPlacement="start"
                      />
                    </div>
                    <div>
                      <label>Stable</label>
                      <Dropdown disabled={!horseRaceDetail.claimed} options={stables} filter={true} value={horseRaceDetail.claimedBy} onChange={onStableSelection} />
                    </div>
                    <div>
                      <InputLabel htmlFor="formatted-text-mask-input">Positions</InputLabel>
                      <FormControl variant="outlined" style={{ margin: 1, minWidth: 100 }}>
                        <InputLabel>
                          Started
                        </InputLabel>
                        <Select
                          value={horseRaceDetail.positions.start || ''}
                          onChange={(e) => setHorseRaceDetail({ ...horseRaceDetail, positions: { ...horseRaceDetail.positions, start: e.target.value } })}
                          input={<OutlinedInput labelWidth={50} name="start" id="outlined-start-simple" />}
                          disabled={selectedHorse.retired}
                        >
                          {
                            positions.map(el => { return <MenuItem value={el} key={el}>{el}</MenuItem> })
                          }

                        </Select>
                      </FormControl>



                      <FormControl variant="outlined" style={{ margin: 1, minWidth: 100 }}>
                        <InputLabel >
                          1/4
                        </InputLabel>

                        <Select
                          value={horseRaceDetail.positions.quarterMile || ''}
                          onChange={(e) => setHorseRaceDetail({ ...horseRaceDetail, positions: { ...horseRaceDetail.positions, quarterMile: e.target.value } })}
                          input={<OutlinedInput labelWidth={30} name="quarterMile" />}
                          disabled={selectedHorse.retired}
                        >
                          {
                            positions.map(el => {
                              console.log(el)
                              return <MenuItem value={el} key={el}>{el}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div>

                    <div style={{marginBottom: '15px'}}>
                      <InputLabel htmlFor="formatted-text-mask-input">Finish Time</InputLabel>
                      <Input
                        value={horseRaceDetail.finishTime}
                        onFocus={(e) => e.target.select()}
                        onBlur={e => {
                          if (e.target.value.trim().length === 6 && e.target.value !== horseRaceDetail.finishTime) {
                            setHorseRaceDetail({ ...horseRaceDetail, finishTime: e.target.value });
                          }
                        }}
                        id="formatted-text-mask-input"
                        inputComponent={TextMaskCustom}
                        disabled={selectedHorse.retired}
                      />
                    </div>

                    <div>
                      <label>Bet</label>
                      <Dropdown disabled={selectedHorse.retired} options={bettingList.map(bet => { return { label: bet, value: bet } })} filter={true} value={horseRaceDetail.bet} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, bet: e.target.value })} />
                    </div>

                    <div>
                      <FormLabel component="legend">Horse Equipments</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        {
                          horseEquipments.map(eq => {
                            return (
                              <FormControlLabel disabled={selectedHorse.retired} key={eq}
                                control={<Checkbox checked={horseRaceDetail.horseEquipments.indexOf(eq) > -1} onChange={onEquipMedicationChange(eq, "horseEquipments")} value={eq} />}
                                label={eq}
                              />
                            )
                          })
                        }
                      </FormGroup>
                    </div>

                    <div>
                      <FormLabel component="legend">Horse Medications</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        <FormControlLabel disabled={selectedHorse.retired}
                          control={<Checkbox checked={horseRaceDetail.horseMedications.indexOf("L") > -1} onChange={onEquipMedicationChange("L", "horseMedications")} value="L" />}
                          label="L"
                        />
                        <FormControlLabel disabled={selectedHorse.retired}
                          control={<Checkbox checked={horseRaceDetail.horseMedications.indexOf("B") > -1} onChange={onEquipMedicationChange("B", "horseMedications")} value="B" />}
                          label="B"
                        />
                      </FormGroup>
                    </div>

                    <div>
                      <InputTextarea rows={5} cols={30} value={horseRaceDetail.comments || ""} onChange={(e) => setHorseRaceDetail({ ...horseRaceDetail, comments: e.target.value })} autoResize={true} />
                    </div>

                    <div>
                      <FormControlLabel
                        control={<Checkbox checked={horseRaceDetail.confirmed} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, confirmed: e.target.checked })} value="true" />}
                        label="Confirmed"
                      />
                    </div>

                  </div>
                </div>


              </React.Fragment>
            }
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHorseRaceDetails} >
            Close
          </Button>
          <Button color="primary" onClick={saveHorseRaceDetailsHandler}>
            Save
          </Button>
        </DialogActions>

      </Dialog>
      {/* HORSE RACE DETAILS DIALOG ENDING*/}


      {/* Loader and Spinner*/}
      {
        loading &&
        <React.Fragment>
          <Backdrop />
          <Spinner />
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