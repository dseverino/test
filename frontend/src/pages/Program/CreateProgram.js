import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
//import Backdrop from "../components/Backdrop/Backdrop";
//import TestModal from "../components/Modal/Modal";
//import Modal from "react-bootstrap-modal";
import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";
import {Calendar} from 'primereact/calendar';
//import ModalHeader from "react-bootstrap/ModalHeader";

//import { InputText } from 'primereact/inputtext';
//import { Dropdown } from 'primereact/dropdown';

class CreateHorsePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    horses: [],
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    program: {

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
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value
    this.setState({ horse: newHorse })
  }
  onAgeChangeHandler = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = parseInt(e.target.value)
    this.setState({ horse: newHorse })
  }
  validateProgram = () => {
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
            <label htmlFor="number">Number</label>
            <input type="number" onBlur={this.validateProgram} className="form-control" onChange={this.onHandleChange} id="number" value={this.state.program.number} />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="date">Date</label>
            <Calendar value={this.state.program.date} onChange={this.onHandleChange}></Calendar>
          </div>
          
        </form>
        <button className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header="Horse Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.program.number} already exists!
        </Dialog>
        <Dialog header={this.state.program.number + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Name: {this.state.program.number}
            </div>
            <div>
              Age: {this.state.program.date}
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
