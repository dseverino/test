import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
//import Backdrop from "../components/Backdrop/Backdrop";
//import TestModal from "../components/Modal/Modal";
//import Modal from "react-bootstrap-modal";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Calendar } from 'primereact/calendar';

import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
//import { InputText } from 'primereact/inputtext';
import "./Race.css"

class CreateRacePage extends Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)

    this.events = [
      "1ra Carrera",
      "2da Carrera",
      "3ra Carrera",
      "4ta Carrera",
      "5ta Carrera",
      "6ta Carrera",
    ]
  }

  state = {
    creating: false,
    races: [],
    isLoading: false,
    programExist: false,
    programNotExist: false,
    visible: false,
    created: false,
    claiming1: "",
    claiming2: "",
    labelWidth: 0,
    race: {
      event: "1ra Carrera",
      distance: "1,100 Metros",
      procedences: [],
      horseAge: "3 Años y Mayores",
      claimings: [],
      purse: "",
      date: "",
      programId: "",
      spec: ""
    }
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, created: false });
    this.setState({
      race: {
        event: this.events[this.events.indexOf(this.state.race.event)],
        distance: "1,100 Metros",
        procedences: [],
        horseAge: "3 Años y Mayores",
        claiming1: "",
        claiming2: "",
        purse: "",
        programId: this.state.race.programId,
        spec: ""
      }
    })
  }

  clearValuesHandler = () => {
    let newRrace = {
      ...this.state.race,
      event: this.events[this.events.indexOf(this.state.race.event) + 1],
      distance: "1,100 Metros",
      procedences: [],
      horseAge: "3 Años y Mayores",
      claimings: [],
      purse: "",
      spec: ""
    }
    this.setState({ race: newRrace, claiming1: "", claiming2: "" })
  }

  notExistHandler = () => {
    this.setState({ programNotExist: false })
    this.props.history.push("/createprogram")
  }

  onHandleChange = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace[e.target.id || e.target.name] = e.target.value;
    this.setState({ race: newRace });
  }

  onClaiming1Change = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace.claimings[0] = e.value;

    this.setState({ race: newRace });
    this.setState({ claiming1: e.value });
  }

  onClaiming2Change = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace.claimings[1] = e.value;

    this.setState({ race: newRace });
    this.setState({ claiming2: e.value });
  }

  onNumberChangeHandler = (e) => {

    let newRace = Object.assign({}, this.state.race);
    newRace[e.target.id] = parseInt(e.target.value);
    this.setState({ race: newRace });
  }

  onProgramDateChange = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace[e.target.id || e.target.name] = e.target.value;
    this.setState({ race: newRace }, () => this.loadProgram());
  }

  loadProgram = () => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleProgram($date: String!) {
          singleProgram(date: $date) {
            _id
            number
            races{
              event
            }
          }
        }
      `,
      variables: {
        date: this.state.race.date
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
          throw new Error("Failed");
        }
        return result.json()
      })
      .then(resData => {
        if (resData && resData.data.singleProgram) {
          this.setState({ programExist: true, isLoading: false });
          let newRace = Object.assign({}, this.state.race);
          newRace["programId"] = resData.data.singleProgram.number;

          if (resData.data.singleProgram.races.length) {
            newRace["event"] = this.events[resData.data.singleProgram.races.length]
          }
          this.setState({ race: newRace });
        }
        else {
          this.setState({ programNotExist: true, programExist: false });
        }
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log(error);
      })
  }

  saveHandler = (event) => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateRace($race: RaceInput) {
          createRace(raceInput: $race) {
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
        race: this.state.race
      }
    }

    const token = this.context.token

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Authorization": `Bearer ${token}`,
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
        this.setState({ created: true, isLoading: false });
        this.clearValuesHandler();
      })
      .catch(error => {
        console.log(error);
      })
  }

  onProcedencesChange = (e) => {
    let newRace = Object.assign({}, this.state.race);
    if (e.checked)
      newRace.procedences.push(e.value);
    else
      newRace.procedences.splice(newRace.procedences.indexOf(e.value), 1);
    this.setState({ race: newRace });
  }

  render() {
    const distances = [
      { label: "1,000 Metros", value: "1,000 Metros" },
      { label: "1,100 Metros", value: "1,100 Metros" },
      { label: "1,200 Metros", value: "1,200 Metros" },
      { label: "1,300 Metros", value: "1,300 Metros" },
      { label: "1,400 Metros", value: "1,400 Metros" },
      { label: "1,700 Metros", value: "1,700 Metros" },
      { label: "1,800 Metros", value: "1,800 Metros" },
      { label: "1,900 Metros", value: "1,900 Metros" },
      { label: "2,000 Metros", value: "2,000 Metros" },
    ]
    const claimings = [
      { label: "40,000 Libres", value: "40,000 Libres" },
      { label: "75,000 Libres", value: "75,000 Libres" },
      { label: "75,000 Ganadores de 1 y 2 primeras", value: "75,000 Ganadores de 1 y 2 primeras" },
      { label: "125,000 Libres", value: "125,000 Libres" },
      { label: "125,000 Ganadores de 1 y 2 primeras", value: "125,000 Ganadores de 1 y 2 primeras" },
      { label: "175,000 No Ganadores", value: "175,000 No Ganadores" },
      { label: "225,000 Libres", value: "225,000 Libres" },
      { label: "250,000 Libres", value: "250,000 Libres" },
      { label: "250,000 Ganadores de 1 y 2 primeras", value: "250,000 Ganadores de 1 y 2 primeras" },
      { label: "250,000 No Ganadores", value: "250,000 No Ganadores" },
      { label: "300,000 Libres", value: "300,000 Libres" },
      { label: "300,000 Ganadores de 1 y 2 primeras", value: "300,000 Ganadores de 1 y 2 primeras" },
      { label: "No Reclamables Libres", value: "No Reclamables Libres" },
      { label: "No Reclamables, Ganadores de 1 y 2 primeras", value: "No Reclamables, Ganadores de 1 y 2 primeras" },
      { label: "No Reclamables, No Ganadores", value: "No Reclamables, No Ganadores" }

    ];
    const ages = [
      { label: "2 Años", value: "2 Años" },
      { label: "3 Años", value: "3 Años" },
      { label: "3 Años y Mayores", value: "3 Años y Mayores" }
    ];

    return (
      <React.Fragment>
        <div style={{ width: "60%" }}>
          <form>
            <div className="col-md-3 mb-3">
              <label htmlFor="date">Program Date</label>
              <Calendar dateFormat="dd/mm/yy" id="date" value={this.state.race.date} onChange={this.onProgramDateChange}></Calendar>
            </div>
            <div className="col-md-3 mb-3">
              <TextField id="programId"
                label="Program" disabled={true} keyfilter="pint" value={this.state.race.programId} margin="normal" variant="outlined" />
            </div>

            <div className="col-md-3 mb-3">
              <FormControl disabled={true} variant="outlined" style={{ width: "85%" }}>
                <InputLabel htmlFor="event">
                  Event
                </InputLabel>
                <Select value={this.state.race.event} input={<OutlinedInput labelWidth={65} />} name="event" id="event" >
                  <MenuItem key={"1ra Carrera"} value={"1ra Carrera"}>1ra Carrera</MenuItem>
                  <MenuItem key={"2da Carrera"} value={"2da Carrera"}>2da Carrera</MenuItem>
                  <MenuItem key={"3ra Carrera"} value={"3ra Carrera"}>3ra Carrera</MenuItem>
                  <MenuItem key={"4ta Carrera"} value={"4ta Carrera"}>4ta Carrera</MenuItem>
                  <MenuItem key={"5ta Carrera"} value={"5ta Carrera"}>5ta Carrera</MenuItem>
                  <MenuItem key={"6ta Carrera"} value={"6ta Carrera"}>6ta Carrera</MenuItem>
                </Select>
              </FormControl>
            </div>

            <FormControl disabled={!this.state.programExist} className="col-md-3 mb-4" variant="outlined" >
              <InputLabel htmlFor="distance">
                Distance
              </InputLabel>
              <Select value={this.state.race.distance} onChange={this.onHandleChange} input={<OutlinedInput labelWidth={65} />} name="distance" id="distance" >
                {
                  distances.map(distance => {
                    return <MenuItem key={distance.value} value={distance.value}>{distance.label}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <div className="col-md-3 mb-4">
              <label htmlFor="procedences">procedences</label>
              <div style={{ display: "flex" }}>
                <div style={{ width: "100px" }}>
                  <label style={{ marginRight: "10px" }} htmlFor="nativos" className="p-checkbox-label">Nativos</label>
                  <Checkbox disabled={!this.state.programExist} inputId="nativos" value="Nativos" onChange={this.onProcedencesChange} checked={this.state.race.procedences.includes("Nativos")} />
                </div>
                <div className="p-col-12">
                  <label style={{ marginRight: "10px" }} htmlFor="importados" className="p-checkbox-label">Importados</label>
                  <Checkbox disabled={!this.state.programExist} inputId="importados" value="Importados" onChange={this.onProcedencesChange} checked={this.state.race.procedences.includes("Importados")} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div className="col-md-3 mb-3">
                <label htmlFor="claimingPrice">Claiming 1</label>
                <Dropdown className="claiming-dropdown" disabled={!this.state.programExist} id="0" value={this.state.claiming1} options={claimings} onChange={this.onClaiming1Change} />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="claimingType">Claiming 2</label>
                <Dropdown className="claiming-dropdown" disabled={!this.state.programExist || !this.state.claiming1} id="1" value={this.state.claiming2} options={claimings} onChange={this.onClaiming2Change} />
              </div>
            </div>

            <FormControl disabled={!this.state.programExist} className="col-md-3 mb-4" variant="outlined" >
              <InputLabel htmlFor="horseAge">
                Age
              </InputLabel>
              <Select value={this.state.race.horseAge} onChange={this.onHandleChange} input={<OutlinedInput labelWidth={65} />} name="horseAge" id="horseAge" >
                {
                  ages.map(age => {
                    return <MenuItem key={age.value} value={age.value}>{age.label}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <div className="col-md-3 mb-3">
              <TextField label="Spec" disabled={!this.state.programExist} type="text" margin="normal" variant="outlined" onChange={this.onHandleChange} id="spec" value={this.state.race.spec} />
            </div>

            <div className="col-md-3 mb-3">
              <TextField id="purse" disabled={!this.state.programExist} label="Purse" keyfilter="pint"
                onChange={this.onNumberChangeHandler} value={this.state.race.purse} margin="normal" variant="outlined" />
            </div>
          </form>
        </div>

        <button disabled={!this.state.programExist} className="btn btn-secondary">
          Cancel
        </button>
        <button disabled={!this.state.programExist} onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>
        <Button variant="outlined" color="primary">
          Hello World
        </Button>
        <Dialog header="Not exists!" visible={this.state.programNotExist} style={{ width: '50vw' }} modal={true} onHide={this.notExistHandler}>
          Program {this.state.race.prorgramId} does not exist!
        </Dialog>

        <Dialog header={"Race Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={() => this.setState({ created: false })}>
          <div>
            Race created
          </div>
        </Dialog>

        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment >
    );
  }
}

export default CreateRacePage
