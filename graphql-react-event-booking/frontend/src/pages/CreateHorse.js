import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import Backdrop from "../components/Backdrop/Backdrop";
import TestModal from "../components/Modal/Modal";
import Modal from "react-bootstrap-modal";
import { Dialog } from 'primereact/dialog';
import Spinner from "../components/Spinner/Spinner";
//import ModalHeader from "react-bootstrap/ModalHeader";

import "../pages/Horses.css";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

class CreateHorsePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    horses: [],
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    horse: {
      name: "",
      weight: "",
      age: 2,
      color: "Z",
      sex: "M",
      sire: "",
      dam: ""
    }
  }
  isActive = true;

  startCreateHorse = () => {
    this.setState({ exist: true })
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false, created: false })
    this.setState({
      horse: {
        name: "",
        weight: "",
        age: 2,
        color: "Z",
        sex: "M",
        sire: "",
        dam: ""
      }
    })
    document.getElementById("name").focus();
  }

  onHandleChange = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value
    this.setState({ horse: newHorse })
  }

  onAgeChangeHandler = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = parseInt(e.target.value)
    this.setState({ horse: newHorse })
  }

  validateHorse = () => {
    if (!this.state.horse.name) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleHorse($name: String!) {
          singleHorse(name: $name) {
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
        name: this.state.horse.name
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
        if (resData && resData.data.singleHorse) {
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
        mutation CreateHorse($horse: HorseInput) {
          createHorse(horseInput: $horse) {
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
        horse: this.state.horse
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

  render() {
    return (
      <React.Fragment>
        <form>
          <div className="col-md-3 mb-3">
            <label htmlFor="name">Name</label>
            <input type="text" onBlur={this.validateHorse} className="form-control" onChange={this.onHandleChange} id="name" value={this.state.horse.name} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="weight">Weight</label>
            <input type="text" className="form-control" onChange={this.onHandleChange} id="weight" value={this.state.horse.weight} />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="age">Age</label>
            <select className="form-control" onChange={this.onAgeChangeHandler} id="age" value={this.state.horse.age}>
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
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="sex">Color</label>
            <select className="form-control" onChange={this.onHandleChange} id="color" value={this.state.horse.color}>
              <option value="Z">Z</option>
              <option value="Zo">Zo</option>
              <option value="A">A</option>
              <option value="R">R</option>
              <option value="Ro">Ro</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="sex">Sex</label>
            <select className="form-control" id="sex" value={this.state.horse.sex} onChange={this.onHandleChange}>
              <option value="M">M</option>
              <option value="Mc">Mc</option>
              <option value="H">H</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="sire">Sire</label>
            <input type="text" className="form-control" onChange={this.onHandleChange} id="sire" value={this.state.horse.sire} />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="dam">Dam</label>
            <input type="text" className="form-control" onChange={this.onHandleChange} id="dam" value={this.state.horse.dam} />
          </div>
        </form>
        <button className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header= "Horse Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.horse.name} already exists!
        </Dialog>
        <Dialog header={this.state.horse.name + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Name: {this.state.horse.name}
            </div>
            <div>
              Age: {this.state.horse.age}
            </div>
            <div>
              Color: {this.state.horse.color}
            </div>
            <div>
              Sex: {this.state.horse.sex}
            </div>
            <div>
              Sire: {this.state.horse.sire}
            </div>
            <div>
              Dam: {this.state.horse.dam}
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

export default CreateHorsePage
