import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import HorseList from "../components/Horses/HorseList/HorseList"
import Spinner from "../components/Spinner/Spinner";

import AuthContext from "../context/auth-context";

import "../pages/Horses.css";

class HorsesPage extends Component {
  static contextType = AuthContext

  componentDidMount = () => {
    this.fetchHorses()
  }

  componentWillUnmount() {
    this.isActive = false;
  }

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

  onDetailsHandler = (horseId) => {
    this.setState(prevState => {
      const selectedHorse = prevState.horses.find(horse => horse._id === horseId)
      return { selectedHorse: selectedHorse }
    })
  }

  bookHorseHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedHorse: null })
      return;
    }
    const requestBody = {
      query: `
        mutation BookHorse ($id: ID!) {
          bookHorse(horseId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedHorse._id
      }
    }

    fetch("http://localhost:3000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Authorization": `Bearer ${this.context.token}`,
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
        this.setState({ selectedHorse: null })
      })
      .catch(error => {
        console.log(error);
      })
  }

  fetchHorses() {
    //include age
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          horses {
            _id
            name
            weight
            
            color
            sex
            sire
            dam
            stable
          }
        }
      `
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
        if (this.isActive) {          
          this.setState({ horses: resData.data.horses, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  onHandleChange = (e) => {  
    console.log(e.target)  
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value
    this.setState({horse: newHorse})
  }

  modalConfirmHandler = () => {

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
          console.log(resData)
          console.log(prevState)
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
        {(this.state.creating || this.state.selectedHorse) && <Backdrop></Backdrop>}
        {this.state.creating && (
          <Modal title="Add Horse" confirmTitle="Confirm" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
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
          </Modal>
        )}
        {this.state.selectedHorse && (
          <Modal
            title={this.state.selectedHorse.title}
            canCancel
            canConfirm
            confirmTitle={this.context.token ? "Book" : "Confirm"}
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookHorseHandler}
          >
            <h1>{this.state.selectedHorse.name}</h1>
            
            <p>{this.state.selectedHorse.age}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="horses-control">
            <p>Share your own Horses!</p>
            <button onClick={this.startCreateHorse} className="btn">Create Horse</button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
            <HorseList openViewDetails={this.onDetailsHandler} horses={this.state.horses} userId={this.context.userId}></HorseList>
          )}
      </React.Fragment>
    );
  }
}

export default HorsesPage
