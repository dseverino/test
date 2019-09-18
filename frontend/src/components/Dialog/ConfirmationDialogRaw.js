import React from "react";

import { Dropdown } from "primereact/dropdown";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from '@material-ui/core/Button';

const ConfirmationDialogRaw = (props) => {  
  
  const { onClose, open, onHorseAdded, raceId, ...other } = props;
  
  const [values, setValues] = React.useState({
    name: "",
    selectedHorse: null,
    E: true,
    F: true,
    G: false,
    Gs: false,
    LA: false,
    B: true,
    L: false
  });
  const [horseRaceDetail, setHorseRaceDetail] = React.useState({
    jockey: "",
    date: props.date,
    jockeyWeight: "",
    trainer: "",
    stable: "",
    horseWeight: "",
    startingPosition: props.horsesqty,
    raceNumber: props.racenumber,
    horseEquipments: ["E", "F"],
    horseMedications: ["B"],
    horseAge: 0,
    distance: props.distance
  });
  const [horses, setHorses] = React.useState([]);
  const jockeys = props.jockeys.map(jockey => {
    return { label: jockey.name, value: jockey._id }
  })
  const stables = props.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  })
  const trainers = props.trainers.map(trainer => {
    return { label: trainer.name, value: trainer._id }
  })
  const claimings = props.claimings.map(claiming => {
    return { label: claiming, value: claiming }
  })

  const [loading, setLoading] = React.useState(false);

  function handleCancel() {
    setValues({ name: "", selectedHorse: null, E: true, F: true, G: false, Gs: false, LA: false, B: true, L: false })
    setHorseRaceDetail({ jockey: "", date: props.date, jockeyWeight: "", trainer: "", stable: "", horseWeight: "", startingPosition: props.horsesqty, raceNumber: props.racenumber, horseEquipments: ["E", "F"], horseMedications: ["B"], horseAge: 0, distance: props.distance });
    setHorses([])
    onClose();    
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
        this.handleCancel();
        onHorseAdded(raceId, values.selectedHorse._id)
      })
      .catch(error => {
        console.log(error)
        setLoading(false);
      })
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  }

  function fetchHorses() {
    setLoading(true);
    const requestBody = {
      query: `
          query Horse($name: String){
            horse(name: $name) {
              _id
              name            
              sex
              age            
            }
          }
        `,
      variables: {
        name: values.name
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
        setHorses(resData.data.horse);
        setValues({ ...values, ["selectedHorse"]: null });
      })
      .catch(error => {
        console.log(error)
        setLoading(false);
      })
  }

  const onEquipmentChange = (name, col) => event => {
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
    setValues({ ...values, ["selectedHorse"]: e.value })
    horseRaceDetail.horseAge = e.value.age
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Add Horse</DialogTitle>
      <DialogContent dividers>
        <div>
          <TextField
            id="standard-search"
            label="Horse Name"
            type="search"
            margin="normal"
            value={values.name}
            onChange={handleChange('name')}
          >
          </TextField>

          <Button variant="outlined" onClick={fetchHorses}>
            Search
            </Button>
        </div>
        <div>
          {
            horses.length > 0 &&
            <DataTable value={horses} selectionMode="single" selection={values.selectedHorse} onSelectionChange={onHorseSelectionChange}>
              <Column selectionMode="single" style={{ width: '3em' }} />
              <Column field="name" header="Name" />
              <Column field="age" header="Age" />
              <Column field="sex" header="Sex" />
            </DataTable>
          }
          {
            values.selectedHorse &&
            <React.Fragment>
              <div className="col-md-3 mb-3">
                Starting Position <strong>{props.horsesqty}</strong>
              </div>
              <div className="col-md-3 mb-3">
                <label>Jockey</label>
                <Dropdown options={jockeys} filter={true} value={horseRaceDetail.jockey} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["jockey"]: e.value })} />
              </div>
              <div className="col-md-3 mb-3">
                <TextField id="jockeyweight"
                  label="Jockey Weight" type="number" onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["jockeyWeight"]: Number(e.target.value) })} keyfilter="pint" value={horseRaceDetail.jockeyWeight} margin="normal" variant="outlined" />
              </div>
              <div className="col-md-3 mb-3">
                <label>Stable</label>
                <Dropdown options={stables} filter={true} value={horseRaceDetail.stable} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["stable"]: e.value })} />
              </div>
              <div className="col-md-3 mb-3">
                <label>Trainer</label>
                <Dropdown options={trainers} filter={true} value={horseRaceDetail.trainer} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["trainer"]: e.value })} />
              </div>
              <div className="col-md-3 mb-3">
                <TextField id="weight"
                  label="Weight" type="number" onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["horseWeight"]: Number(e.target.value) })} keyfilter="pint" value={horseRaceDetail.horseWeight} margin="normal" variant="outlined" />
              </div>
              <div className="col-md-3 mb-3">
                <label>Claiming</label>
                <Dropdown options={claimings} filter={true} value={horseRaceDetail.claiming} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["claiming"]: e.value })} />
              </div>
              <FormControl component="fieldset">
                <FormLabel component="legend">Horse Equipments</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={values.E} onChange={onEquipmentChange("E", "horseEquipments")} value="E" />}
                    label="E"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={values.F} onChange={onEquipmentChange("F", "horseEquipments")} value="F" />}
                    label="F"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={values.G} onChange={onEquipmentChange("G", "horseEquipments")} value="G" />}
                    label="G"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={values.Gs} onChange={onEquipmentChange("Gs", "horseEquipments")} value="Gs" />}
                    label="Gs"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={values.LA} onChange={onEquipmentChange("LA", "horseEquipments")} value="LA" />}
                    label="LA"
                  />
                </FormGroup>
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend">Horse Medications</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={values.L} onChange={onEquipmentChange("L", "horseMedications")} value="L" />}
                    label="L"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={values.B} onChange={onEquipmentChange("B", "horseMedications")} value="B" />}
                    label="B"
                  />
                </FormGroup>
              </FormControl>

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
    </Dialog>
  )
}

export default ConfirmationDialogRaw;