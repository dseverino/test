import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
//import Backdrop from "../components/Backdrop/Backdrop";
//import TestModal from "../components/Modal/Modal";
//import Modal from "react-bootstrap-modal";
import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
//import ModalHeader from "react-bootstrap/ModalHeader";

//import { InputText } from 'primereact/inputtext';
//import { Dropdown } from 'primereact/dropdown';

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
    race: {
      event: "1ra Carrera",
      distance: "1,100 Metros",
      procedences: [],
      horseAge: "3 Años y Mayores",
      claimingType: "Libres",
      claimingPrice: "40,000",
      purse: "",
      programId: "",
      spec: ""
    }
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, programExist: false, created: false })
    this.setState({
      race: {
        event: this.events[this.events.indexOf(this.state.race.event)],
        distance: "1,100 Metros",
        procedences: [],
        horseAge: "3 Años y Mayores",
        claimingType: "Libres",
        claimingPrice: "40,000",
        purse: "",
        programId: "",
        spec: ""
      }
    })
  }

  notExistHandler = () => {
    this.setState({ programNotExist: false })
  }

  onHandleChange = (e) => {
    let newRace = Object.assign({}, this.state.race)
    newRace[e.target.id] = e.target.value
    this.setState({ race: newRace })
  }

  onNumberChangeHandler = (e) => {

    let newRace = Object.assign({}, this.state.race);
    newRace[e.target.id] = parseInt(e.target.value);
    this.setState({ race: newRace });
  }

  validateProgram = () => {
    if (!this.state.race.programId) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleProgram($programId: Int!) {
          singleProgram(programId: $programId) {
            _id
            races{
              event
            }
          }
        }
      `,
      variables: {
        programId: this.state.race.programId
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
          if (resData.data.singleProgram.races.length) {            
            let newRace = Object.assign({}, this.state.race);
            newRace["event"] = this.events[resData.data.singleProgram.races.length]
            this.setState({ race: newRace });
          }
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
            claimingPrice
            claimingType
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
        this.setState((prevState) => {
          return { isLoading: false }
        })
        this.setState({ created: true })

      })
      .catch(error => {
        console.log(error);
      })
  }

  onProcedencesChange = (e) => {
    console.log(e)
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
    const claimingPrices = [
      { label: "40,000", value: "40,000" },
      { label: "75,000", value: "75,000" },
      { label: "125,000", value: "125,000" },
      { label: "No Reclamables", value: "No Reclamables" }
    ]
    const claimingTypes = [
      { label: "Libres", value: "Libres" },
      { label: "Ganadores de 1 y 2 primeras", value: "Ganadores de 1 y 2 primeras" },
      { label: "No Ganadores", value: "No Ganadores" }
    ]
    const ages = [
      { label: "2 Años", value: "2 Años" },
      { label: "3 Años", value: "3 Años" },
      { label: "3 Años y Mayores", value: "3 Años y Mayores" }
    ]
    return (
      <React.Fragment>
        <form>
          <div className="col-md-3 mb-3">
            <label htmlFor="programId">Program</label>
            <InputText keyfilter="pint" onBlur={this.validateProgram} className="form-control" onChange={this.onNumberChangeHandler} id="programId" value={this.state.race.programId} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="event">Event</label>
            <InputText disabled={true} className="form-control" id="event" value={this.state.race.event} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="distance">Distance</label>
            <Dropdown disabled={!this.state.programExist} id="distance" value={this.state.race.distance} options={distances} onChange={this.onHandleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="claimingPrice">Claiming Price</label>
            <Dropdown disabled={!this.state.programExist} id="claimingPrice" value={this.state.race.claimingPrice} options={claimingPrices} onChange={this.onHandleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="claimingType">Claiming Type</label>
            <Dropdown disabled={!this.state.programExist} id="claimingType" value={this.state.race.claimingType} options={claimingTypes} onChange={this.onHandleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="procedences">procedences</label>
            <div className="p-col-12">
              <label htmlFor="nativos" className="p-checkbox-label">Nativos</label>
              <Checkbox disabled={!this.state.programExist} inputId="nativos" value="Nativos" onChange={this.onProcedencesChange} checked={this.state.race.procedences.includes("Nativos")} />
            </div>
            <div className="p-col-12">
              <label htmlFor="importados" className="p-checkbox-label">Importados</label>
              <Checkbox disabled={!this.state.programExist} inputId="importados" value="Importados" onChange={this.onProcedencesChange} checked={this.state.race.procedences.includes("Importados")} />
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="horseAge">Age</label>
            <Dropdown disabled={!this.state.programExist} id="claimingType" value={this.state.race.horseAge} options={ages} onChange={this.onHandleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="spec">Specifications</label>
            <input disabled={!this.state.programExist} type="text" className="form-control" onChange={this.onHandleChange} id="spec" value={this.state.race.spec} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="purse">Purse</label>
            <InputText disabled={!this.state.programExist} keyfilter="pint" className="form-control" value={this.state.race.purse} onChange={this.onNumberChangeHandler} id="purse" />
          </div>
        </form>

        <button className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header="Not exists!" visible={this.state.programNotExist} style={{ width: '50vw' }} modal={true} onHide={this.notExistHandler}>
          Program {this.state.race.prorgramId} does not exist!
        </Dialog>

        <Dialog header={this.state.race.event + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Event: {this.state.race.event}
            </div>
            <div>
              Distance: {this.state.race.distance}
            </div>
            <div>
              Procedence: {this.state.race.procedences.toString()}
            </div>
            <div>
              Age: {this.state.race.horseAge}
            </div>
            <div>
              Claiming: {this.state.race.claimingPrice} {this.state.race.claimingType}
            </div>
            <div>
              Event: {this.state.race.event}
            </div>
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
