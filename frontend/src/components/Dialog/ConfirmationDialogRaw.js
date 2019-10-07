import React from "react";

import "./ConfirmationDialogRaw.css";

import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";
import HorseNameInput from "../../components/TextFields/HorseNameInput";
import SaveHorseButton from "../../components/Buttons/SaveHorseButton";
import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";
import SaveStableButton from "../../components/Buttons/SaveStableButton";
import StableInput from "../../components/TextFields/StableNameInput";

import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from "primereact/dropdown";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import Icon from '@material-ui/core/Icon';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import AddHorseDialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';

const ConfirmationDialogRaw = (props) => {

  const nameRef = React.createRef();

  React.useEffect(() => {
    if (props.open) {
      nameRef.current.focus();
    }
  }, [props.open])

  const { onClose, open, onHorseAdded, raceId, horsesqty, ...other } = props;
  const [saved, setSaved] = React.useState(false)
  const [horseNotFound, setHorseNotFound] = React.useState(false);
  const [createStable, setCreateStable] = React.useState(false);
  const [createTrainer, setCreateTrainer] = React.useState(false);
  const [stable, setStable] = React.useState({ name: "" })
  const [stableCreated, setStableCreated] = React.useState(false)

  const [values, setValues] = React.useState({
    selectedHorse: null,
    selectedStable: { _id: "" },
    E: true,
    F: true,
    G: false,
    Gs: false,
    LA: false,
    B: true,
    L: false
  });

  const [horseDialog, setHorseDialog] = React.useState(false);

  const [horseRaceDetail, setHorseRaceDetail] = React.useState({
    jockey: "",
    date: props.date,
    jockeyWeight: "",
    trainer: "",
    stable: "",
    horseWeight: 0,
    startingPosition: props.horsesqty,
    raceNumber: props.racenumber,
    horseEquipments: ["E", "F"],
    horseMedications: ["B"],
    horseAge: 0,
    distance: props.distance,
    claiming: ""
  });

  const [horses, setHorses] = React.useState([]);

  const [horse, setHorse] = React.useState({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "" });

  const jockeys = props.jockeys.map(jockey => {
    return { label: jockey.name, value: jockey._id }
  })
  const [stables, setStables] = React.useState(props.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  }));

  const trainers = props.trainers.map(trainer => {
    return { label: trainer.name, value: trainer._id }
  })
  const claimings = props.claimings.map(claiming => {
    return { label: claiming, value: claiming }
  })

  const [loading, setLoading] = React.useState(false);

  function handleCancel() {
    clearValues()
    onClose();
  }

  function clearValues() {
    setHorse({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "" })
    setValues({ selectedHorse: null, E: true, F: true, G: false, Gs: false, LA: false, B: true, L: false })
    setHorseRaceDetail({ jockey: "", date: props.date, jockeyWeight: "", trainer: "", stable: "", horseWeight: "", startingPosition: props.horsesqty, raceNumber: props.racenumber, horseEquipments: ["E", "F"], horseMedications: ["B"], horseAge: 0, distance: props.distance });
    setHorses([])
  }

  function handleAdd() {
    setLoading(true);
    const requestBody = {
      query: `
        mutation CreateHorseRaceDetail($horseRaceDetail: HorseRaceDetailInput, $horseId: ID){
          createHorseRaceDetail(horseRaceDetail: $horseRaceDetail, horseId: $horseId){
            _id
            startingPosition
          }  
        }          
      `,
      variables: {
        horseRaceDetail: horseRaceDetail, horseId: values.selectedHorse._id
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
        setLoading(false);
        onHorseAdded(props.index, raceId, values.selectedHorse);
        handleCancel();
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }

  const onHorseHandleChange = e => {
    let newHorse = Object.assign({}, horse)
    newHorse[e.target.id] = e.target.value

    setHorse(newHorse)
  }

  function fetchHorses() {
    //setLoading(true);
    const requestBody = {
      query: `
        query Horse($name: String){
          horse(name: $name) {
            _id
            name
            weight
            age
            color
            sex
            sire
            dam
            stable {         
              _id
              name
              trainers {
                _id
                name
              }
            }            
          }
        }
      `,
      variables: {
        name: horse.name
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
        if (resData.data.horse && resData.data.horse.length === 1) {
          setValues({ ...values, "selectedHorse": resData.data.horse[0] });
          setHorseRaceDetail(
            {
              ...horseRaceDetail, horseAge: resData.data.horse[0].age, stable: resData.data.horse[0].stable._id, trainer: resData.data.horse[0].stable.trainers && resData.data.horse[0].stable.trainers.length === 1 ? resData.data.horse[0].stable.trainers[0]._id : "", claiming: props.claimings.length === 1 ? props.claimings[0] : "",
              horseWeight: resData.data.horse[0].weight || 0
            }
          );
        }
        else if (resData.data.horse.length > 1) {
          setHorses(resData.data.horse);
          setValues({ ...values, "selectedHorse": null });

          setHorseRaceDetail({ jockey: "", date: props.date, jockeyWeight: "", trainer: "", stable: "", horseWeight: "", startingPosition: props.horsesqty, raceNumber: props.racenumber, horseEquipments: ["E", "F"], horseMedications: ["B"], horseAge: 0, distance: props.distance });
        }
        else {
          setHorseNotFound(true);
        }
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
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

  const onHorseSelectionChange = (e) => {
    setValues({ ...values, "selectedHorse": e.value });
    setHorseRaceDetail({ ...horseRaceDetail, horseAge: e.value.age, stable: e.value.stable._id, trainer: e.value.stable.trainers && e.value.stable.trainers.length === 1 ? e.value.stable.trainers[0]._id : "", claiming: props.claimings.length === 1 ? props.claimings[0] : "" });
  }

  React.useEffect(() => {
    if (values.selectedHorse) {
      setHorseRaceDetail({ ...horseRaceDetail, horseWeight: values.selectedHorse.weight || "" });
    }
  }, [values.selectedHorse])

  const onStableSelection = (e) => {
    const trainers = values.selectedHorse.stable.trainers;
    setHorseRaceDetail({ ...horseRaceDetail, "stable": e.value, "trainer": trainers.length === 1 ? trainers[0]._id : "" });
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      fetchHorses();
    }
  }

  function onAddTrainerIconClick(event) {
    setCreateTrainer(true);
  }

  function onHorseWeightChange(e) {
    setHorseRaceDetail({ ...horseRaceDetail, "horseWeight": Number(e.target.value) || 0 })
    /*console.log(e.target.value.length)
    
    console.log(values.selectedHorse)
    if(values.selectedHorse.weight > 0 && e.target.value.length >= 3 && values.selectedHorse.weight != e.target.value){
      console.log('different')
      //si el peso viejo 980 - el actual peso 960 
    }*/
  }

  function onAddHoseIconClick() {
    setHorseDialog(true)
  }

  function closeHorseDialog() {
    setHorseDialog(false)
    setHorse({ name: "", weight: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "" });
    setValues({ ...values, selectedStable: {} })
  }

  function onHorseAgeChangeHandler(e) {
    let ob = Object.assign({}, horse);
    ob[e.target.id] = parseInt(e.target.value) || 0
    setHorse(ob)
  }

  function onHorseChangeHandler(e) {
    setHorse({ ...horse, [e.target.id]: e.target.value })
  }

  function savedHorse(horse) {
    setSaved(true);
    setHorseDialog(false);
    setHorse({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "" })
    setValues({ ...values, selectedHorse: horse });
    setHorseRaceDetail({ ...horseRaceDetail, horseWeight: horse.weight, horseAge: horse.age, stable: horse.stable._id, trainer: horse.stable.trainers && horse.stable.trainers.length === 1 ? horse.stable.trainers[0]._id : "", claiming: props.claimings.length === 1 ? props.claimings[0] : "" });
  }

  function onValidateHorse(horse) {
    if (horse) {
      setHorse(
        {
          name: "",
          weight: 0,
          age: 3,
          color: "Z",
          sex: "M",
          sire: "",
          dam: "",
          stable: ""

        }
      )
    }
  }

  function onHorseSnackBarClose(e, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSaved(false);
    setHorse({ name: "", weight: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "" });
    setValues({ ...values, selectedStable: {} })
  }

  function onHorseNotFoundSnackBarClose() {
    setHorseNotFound(false);
    setHorseDialog(true);
  }
  function onHorseStableChangeHandler(e) {
    let newHorse = Object.assign({}, horse)
    newHorse[e.target.id] = e.target.value

    setHorse(newHorse)
    setValues({ ...values, selectedStable: e.target.value })

  }

  function onCloseCreateStableDialog() {
    setCreateStable(false);
    setStable({ name: "" })
  }

  function onStableNameHandlerChange(value) {
    setStable({ name: value })
  }

  function onValidateStable(stable) {
    if (stable) {
      setStable({ name: "" })
    }
  }

  function onAddStableIconClick() {
    setCreateStable(true);
  }

  function savedStable(stable) {
    if (stable) {
      setCreateStable(false);
      setStableCreated(true);
      let newHorse = Object.assign({}, horse);
      newHorse["stable"] = stable._id;
      setHorse(newHorse);
      setValues({ ...values, selectedStable: stable._id });
      setStables([...stables, { label: stable.name, value: stable._id }]);
    }
  }

  function onStableSnackBarClose() {
    setStableCreated(false);
    setStable({ name: "" })
  }

  return (
    <React.Fragment>
      {/* Add Horse Dialog*/}
      <AddHorseDialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Add Horse</DialogTitle>
        <DialogContent dividers>
          <div>
            <InputLabel htmlFor="component-simple">Name</InputLabel>
            <Input inputRef={nameRef} id="name" value={horse.name} onChange={onHorseHandleChange} onKeyPress={handleKeyPress} />

            <Button variant="outlined" onClick={fetchHorses} style={{ marginLeft: "15px", marginBottom: "5px" }}>
              Search
            </Button>
            <span>
              <AddIcon color="secondary" onClick={onAddHoseIconClick}></AddIcon>
            </span>
          </div>
          <div>
            {
              horses.length > 0 && !values.selectedHorse &&
              <DataTable value={horses} selectionMode="single" selection={values.selectedHorse} onSelectionChange={onHorseSelectionChange}>
                <Column selectionMode="single" style={{ width: '3em' }} />
                <Column field="name" header="Name" />
                <Column field="age" header="Age" />
                <Column field="color" header="Color" />
                <Column field="sex" header="Sex" />
                <Column field="stable.name" header="Stable" />
              </DataTable>
            }
            {
              values.selectedHorse &&
              <React.Fragment>
                <div style={{ display: "flex", margin: "10px", justifyContent: "space-between" }}>
                  <div><strong>{values.selectedHorse.name}</strong></div>
                  <div>{values.selectedHorse.age} - {values.selectedHorse.color} - {values.selectedHorse.sex}</div>
                  <div>{values.selectedHorse.stable.name}</div>
                </div>
                <Fieldset legend="Race Details">
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        Starting Position <strong>{horsesqty}</strong>
                      </div>
                      <div>
                        <label>Jockey</label>
                        <Dropdown options={jockeys} filter={true} value={horseRaceDetail.jockey} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockey": e.value })} />
                      </div>
                      <div>
                        <TextField id="jockeyweight"
                          label="Jockey Weight" type="number" onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockeyWeight": Number(e.target.value) })} keyfilter="pint" value={horseRaceDetail.jockeyWeight} margin="normal" variant="outlined" />
                      </div>
                      <div>
                        <label>Stable</label>
                        <Dropdown options={stables} filter={true} value={horseRaceDetail.stable} onChange={onStableSelection} />
                      </div>
                      <div>
                        <label>Trainer</label>
                        <div>
                          <Dropdown options={trainers} filter={true} value={horseRaceDetail.trainer} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "trainer": e.value })} />
                          <span>
                            <AddIcon color="secondary" onClick={onAddTrainerIconClick}></AddIcon>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "50%" }}>
                      <div>
                        <TextField id="weight"
                          label="Weight" type="number" onChange={onHorseWeightChange} keyfilter="pint" value={horseRaceDetail.horseWeight} margin="normal" variant="outlined" />
                      </div>
                      <div>
                        <label>Claiming</label>
                        <Dropdown options={claimings} filter={true} value={horseRaceDetail.claiming} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "claiming": e.value })} />
                      </div>
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
                    </div>
                  </div>
                </Fieldset>
              </React.Fragment>
            }

          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
        </Button>
        </DialogActions>
      </AddHorseDialog>


      {/*Create Horse Dialog*/}
      <AddHorseDialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={horseDialog}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Create Horse</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>
            <div>
              <HorseNameInput validateHorse={onValidateHorse} change={onHorseHandleChange} name={horse.name} />
            </div>
            <div>
              <TextField
                id="weight"
                type="number"
                variant="outlined"
                label="Weight"
                value={horse.weight}
                onChange={onHorseAgeChangeHandler}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
                }}
              />
            </div>
            <div>
              <label htmlFor="age">Age</label>
              <select className="form-control" onChange={onHorseAgeChangeHandler} id="age" value={horse.age}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
              </select>
            </div>
            <div>
              <label htmlFor="color">Color</label>
              <select className="form-control" onChange={onHorseChangeHandler} id="color" value={horse.color}>
                <option value="Z">Z</option>
                <option value="Zo">Zo</option>
                <option value="A">A</option>
                <option value="R">R</option>
                <option value="Ro">Ro</option>
              </select>
            </div>
          </div>
          <div style={{ margin: "0px 10px" }}>
            <div>
              <label htmlFor="sex">Sex</label>
              <select className="form-control" id="sex" value={horse.sex} onChange={onHorseChangeHandler}>
                <option value="M">M</option>
                <option value="Mc">Mc</option>
                <option value="H">H</option>
              </select>
            </div>
            <div>
              <TextField label="Sire" onChange={onHorseChangeHandler} id="sire" value={horse.sire} margin="normal" variant="outlined" />
            </div>
            <div>
              <TextField label="Dam" onChange={onHorseChangeHandler} id="dam" value={horse.dam} margin="normal" variant="outlined" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="stable">Stable</label>
              <div>
                <Dropdown id="stable" filter={true} value={values.selectedStable} options={stables} onChange={onHorseStableChangeHandler} placeholder="Select a Stable" />
                <span>
                  <AddIcon color="secondary" onClick={onAddStableIconClick}></AddIcon>
                </span>
              </div>
            </div>

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHorseDialog} >
            Close
          </Button>
          <SaveHorseButton horse={horse} savedHorse={savedHorse}></SaveHorseButton>
        </DialogActions>
      </AddHorseDialog>
      {/*Create Horse Dialog END....*/}


      {/* Create Stable Dialog */}
      <AddHorseDialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={createStable}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Create Stable</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>
            <StableInput id="name" validateStable={onValidateStable} change={onStableNameHandlerChange} name={stable.name} />

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCreateStableDialog} >
            Cancel
          </Button>
          <SaveStableButton stable={stable} savedStable={savedStable} />
        </DialogActions>
      </AddHorseDialog>


      {/* Create Trainer Dialog */}
      <AddHorseDialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={createTrainer}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Create Trainer</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>
            <StableInput id="name" validateStable={onValidateStable} change={onStableNameHandlerChange} name={stable.name} />

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCreateStableDialog} >
            Cancel
          </Button>
          <SaveStableButton stable={stable} savedStable={savedStable} />
        </DialogActions>
      </AddHorseDialog>


      {/*Horse Created Snackbar*/}
      <SnackbarSuccess
        open={saved}
        onClose={onHorseSnackBarClose}
        variant={"success"}
        message={`Horse ${horse.name} Created!`}
        autoHideDuration={5000}
      >
      </SnackbarSuccess>

      {/*Horse Not Exist Snackbar*/}
      <SnackbarSuccess
        open={horseNotFound}
        onClose={onHorseNotFoundSnackBarClose}
        variant={"warning"}
        message="Horse not found!"
        autoHideDuration={1000}
      >
      </SnackbarSuccess>

      {/*Stable Created Snackbar*/}
      <SnackbarSuccess
        open={stableCreated}
        onClose={onStableSnackBarClose}
        variant={"success"}
        message={`Stable ${stable.name} created!`}
        autoHideDuration={3000}
      >
      </SnackbarSuccess>


      {/* Loader and Spinner*/}
      {
        loading &&
        <React.Fragment>
          <Spinner />
          <Backdrop />
        </React.Fragment>
      }

    </React.Fragment>

  )
}

export default ConfirmationDialogRaw;