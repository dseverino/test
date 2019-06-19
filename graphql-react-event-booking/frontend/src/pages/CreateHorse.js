import React, { Component } from "react";

import AuthContext from "../context/auth-context";

import "../pages/Horses.css";

class CreateHorsePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    horses: [],
    isLoading: false,
    selectedHorse: null,
    horse: {
      name: '',
      weight: "",
      age: "",
      color: "",
      sex: "",
      sire: "",
      dam: "",
      stable: ""
    }
  }
  isActive = true;

  startCreateHorse = () => {
    this.setState({ creating: true })
  }

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedHorse: null })
  }

  onHandleChange = (e) => {
    console.log(e.target)
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value
    this.setState({ horse: newHorse })
  }

  saveHandler = () => {

    const requestBody = {
      query: `
        mutation CreateHorse($horse: HorseInput) {
          createHorse(horseInput: $horse) {
            name
            weight
            age
            color
            sex
            sire
            dam
            stable
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
          return { horses: [...prevState.horses, resData.data.createHorse] }
        })
        this.modalCancelHandler();
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <React.Fragment>
        <form>
          <div className="form-control">
            <label htmlFor="name">Name</label>
            <input type="text" onChange={this.onHandleChange} id="name" value={this.state.horse.name} />
          </div>
          <div className="form-control">
            <label htmlFor="weight">Weight</label>
            <input type="text" onChange={this.onHandleChange} id="weight" value={this.state.horse.weight} />
          </div>
          <div className="form-control">
            <label htmlFor="age">Age</label>
            <input type="text" onChange={this.onHandleChange} id="age" value={this.state.horse.age} />
          </div>
          <div className="form-control">
            <label htmlFor="color">Color</label>
            <input type="text" onChange={this.onHandleChange} id="color" value={this.state.horse.color} />
          </div>
          <div className="form-control">
            <label htmlFor="sex">Sex</label>
            <input type="text" onChange={this.onHandleChange} id="sex" value={this.state.horse.sex} />
          </div>
          <div className="form-control">
            <label htmlFor="sire">Sire</label>
            <input type="text" onChange={this.onHandleChange} id="sire" value={this.state.horse.sire} />
          </div>
          <div className="form-control">
            <label htmlFor="dam">Dam</label>
            <input type="text" onChange={this.onHandleChange} id="dam" value={this.state.horse.dam} />
          </div>
          <div className="form-control">
            <label htmlFor="stable">Stable</label>
            <input type="text" onChange={this.onHandleChange} id="stable" value={this.state.horse.stable} />
          </div>
        </form>
      </React.Fragment >
    );
  }
}

export default CreateHorsePage
