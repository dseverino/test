import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
//import Backdrop from "../components/Backdrop/Backdrop";
//import TestModal from "../components/Modal/Modal";
//import Modal from "react-bootstrap-modal";
import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
//import ModalHeader from "react-bootstrap/ModalHeader";

//import { InputText } from 'primereact/inputtext';
//import { Dropdown } from 'primereact/dropdown';

class CreateRacePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    races: [],
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    race: {
      programId: null,
      event: null,
      distance: null,
      procedence: []
    }
  }

  claimingTypes = [
    {label: 'Libres', value: 'Libres'},
    {label: 'Ganadores de 1 y 2 primeras', value: 'Ganadores de 1 y 2 primeras'},
    {label: 'No Ganadores', value: 'No Ganadores'}
  ];

  isActive = true;

  startCreateRace = () => {
    this.setState({ exist: true })
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false, created: false })
    this.setState({
      race: {
        name: "",
        weight: "",
        age: 3,
        color: "Z",
        sex: "M",
        sire: "",
        dam: ""
      }
    })
    document.getElementById("name").focus();
  }

  onHandleChange = (e) => {
    let newRace = Object.assign({}, this.state.race)
    newRace[e.target.id] = e.target.value
    this.setState({ race: newRace })
  }
  onNumberChangeHandler = (e) => {
    let newRace = Object.assign({}, this.state.race)
    newRace[e.target.id] = parseInt(e.target.value)
    this.setState({ race: newRace })
  }
  validateProgram = () => {
    if (!this.state.race.name) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleProgram($program: String!) {
          singleProgram(name: $name) {
            name
            weight
            age
            color
            sex
            sire
            dam
          }
        }
      `,
      variables: {
        name: this.state.race.name
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
        if (resData && resData.data.singleRace) {
          this.setState({ exist: true, isLoading: false })          
        }
        else {
          this.setState({ isLoading: false })
          document.getElementById("weight").focus();
        }
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
            _id
            name
            weight
            age
            color
            sex
            sire
            dam
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

  onProcedenceChange = (e) => {
    console.log(e)
    let newRace = Object.assign({}, this.state.race)
    //newRace[e.target.id] = e.target.value
    //this.setState({ race: newRace });    
  }
  render() {
    return (
      <React.Fragment>
        <form>
          <div className="col-md-3 mb-3">
            <label htmlFor="program">Program</label>
            <input type="text" onBlur={this.validateProgram} className="form-control" onChange={this.onHandleChange} id="program" value={this.state.race.program} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="event">Event</label>
            <select className="form-control" onChange={this.onHandleChange} id="event" value={this.state.race.event}>
              <option value="1ra">1ra</option>
              <option value="2da">2da</option>
              <option value="3ra">3ra</option>
              <option value="4ta">4ta</option>
              <option value="5ta">5ta</option>
              <option value="6ta">6ta</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="distance">Distance</label>
            <select className="form-control" onChange={this.onHandleChange} id="distance" value={this.state.race.distance}>
              <option value="1000">1,000 Metros</option>
              <option value="1100">1,100 Metros</option>
              <option value="1200">1,200 Metros</option>
              <option value="1300">1,300 Metros</option>
              <option value="1400">1,400 Metros</option>
              <option value="1700">1,700 Metros</option>
              <option value="1800">1,800 Metros</option>
              <option value="1900">1,900 Metros</option>
              <option value="2000">2,000 Metros</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="claimingPrice">Claiming Price</label>
            <select className="form-control" id="claimingPrice" value={this.state.race.claimingPrice} onChange={this.onHandleChange}>
              <option value="40,000">40,000</option>
              <option value="75,000">75,000</option>
              <option value="125,000">125,000</option>
              <option value="No Reclamables">No Reclamables</option>
            </select>
                        
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="claimingType">Claiming Type</label>
            <Dropdown value={this.state.race.claimingType} options={this.claimingTypes} />
          </div>          

          <div className="col-md-3 mb-3">
            <label htmlFor="procedence">Procedence</label>
            <Checkbox inputId="Nativos" value="Nativos" onChange={this.onProcedenceChange}></Checkbox>
            <Checkbox inputId="Importados" value="Importados" onChange={this.onProcedenceChange}></Checkbox>            
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="dam">Dam</label>
            <input type="text" className="form-control" onChange={this.onHandleChange} id="dam" value={this.state.race.dam} />
          </div>
        </form>
        <button className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header= "Race Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.race.name} already exists!
        </Dialog>
        <Dialog header={this.state.race.name + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Name: {this.state.race.name}
            </div>
            <div>
              Age: {this.state.race.age}
            </div>
            <div>
              Color: {this.state.race.color}
            </div>
            <div>
              Sex: {this.state.race.sex}
            </div>
            <div>
              Sire: {this.state.race.sire}
            </div>
            <div>
              Dam: {this.state.race.dam}
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
