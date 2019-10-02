import React from "react";

import "./ConfirmationDialogRaw.css";

import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";

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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const ConfirmationDialogRaw = (props) => {

  const nameRef = React.createRef();

  React.useEffect(() => {
    if (props.open) {
      nameRef.current.focus();
    }
  }, [props.open])

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
    clearValues()
    onClose();
  }

  function clearValues() {
    setValues({ name: "", selectedHorse: null, E: true, F: true, G: false, Gs: false, LA: false, B: true, L: false })
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

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
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
        if (resData.data.horse && resData.data.horse.length === 1) {
          setValues({ ...values, "selectedHorse": resData.data.horse[0] });
          setHorseRaceDetail(
            {
              ...horseRaceDetail, horseAge: resData.data.horse[0].age, stable: resData.data.horse[0].stable._id, trainer: resData.data.horse[0].stable.trainers && resData.data.horse[0].stable.trainers.length === 1 ? resData.data.horse[0].stable.trainers[0]._id : "", claiming: props.claimings.length === 1 ? props.claimings[0] : "",
              horseWeight: resData.data.horse[0].weight || 0
            });
        }
        else {
          setHorses(resData.data.horse);
          setValues({ ...values, "selectedHorse": null });
          setHorseRaceDetail({ jockey: "", date: props.date, jockeyWeight: "", trainer: "", stable: "", horseWeight: "", startingPosition: props.horsesqty, raceNumber: props.racenumber, horseEquipments: ["E", "F"], horseMedications: ["B"], horseAge: 0, distance: props.distance });
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
      setHorseRaceDetail({ ...horseRaceDetail, horseWeight: values.selectedHorse.weight ? values.selectedHorse.weight : "" });
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

  function onAddIconClick(event) {
    console.log('add clicked!!!')
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

  return (
    <React.Fragment>
      <Dialog
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
            <Input inputRef={nameRef} id="component-simple" value={values.name} onChange={handleChange('name')} onKeyPress={handleKeyPress} />

            <Button variant="outlined" onClick={fetchHorses} style={{ marginLeft: "15px", marginBottom: "5px" }}>
              Search
            </Button>
            <span>
              <AddIcon color="secondary"></AddIcon>
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
                        Starting Position <strong>{horseRaceDetail.startingPosition}</strong>
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
                            <Icon color="disabled" fontSize="large" onClick={onAddIconClick}>
                              add_circle
                            </Icon>
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
      </Dialog>
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