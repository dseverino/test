import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
import Spinner from "../../components/Spinner/Spinner";

import DialogMaterial from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';

import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Fieldset } from 'primereact/fieldset';

//import "../pages/Horses.css";

class CreateHorsePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    horses: [],
    isLoading: false,
    exist: false,
    visible: false,
    createStable: false,
    created: false,
    selectedStable: null,
    stables: [],
    horse: {
      name: "",
      weight: "",
      age: 3,
      color: "Z",
      sex: "M",
      sire: "",
      dam: "",
      stable: ""
    }
  }
  isActive = true;

  componentDidMount() {
    this.loadStables();
  }

  loadStables() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          stables {
            _id
            name
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
        if (resData && resData.data.stables) {
          this.setState({ stables: resData.data.stables, isLoading: false })
        }
        else {
          this.setState({ isLoading: false })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  startCreateHorse = () => {
    this.setState({ exist: true })
  }

  onCancelHandler = (event) => {
    console.log(this.state.horse)
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false, created: false })
    this.setState({
      horse: {
        name: "",
        weight: 0,
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
    newHorse[e.target.id] = parseInt(e.target.value || 0)
    this.setState({ horse: newHorse })
  }
  onStableChangeHandler = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value._id
    this.setState({ selectedStable: e.target.value, horse: newHorse });
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
        this.setState({ created: true, selectedStable: null, isLoading: false })
      })
      .catch(error => {
        console.log(error);
      })
  }

  onAddIconClick = (e) => {
    console.log('hey')
    this.setState({ createStable: true })
  }

  closeStableDialog = (e) => {
    this.setState({ createStable: false })
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  render() {
    return (
      <React.Fragment>
        <Fieldset legend="Create Horse">
          <form style={{ display: "flex" }}>
            <div>
              <div>
                <label htmlFor="name">Name</label>
                <input type="text" onBlur={this.validateHorse} className="form-control" onChange={this.onHandleChange} id="name" value={this.state.horse.name} />
              </div>
              <div>
                <label htmlFor="weight">Weight</label>
                <input type="number" className="form-control" onChange={this.onAgeChangeHandler} id="weight" value={this.state.horse.weight} />
              </div>
              <div>
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
                  <option value="13">13</option>
                </select>
              </div>
              <div>
                <label htmlFor="sex">Color</label>
                <select className="form-control" onChange={this.onHandleChange} id="color" value={this.state.horse.color}>
                  <option value="Z">Z</option>
                  <option value="Zo">Zo</option>
                  <option value="A">A</option>
                  <option value="R">R</option>
                  <option value="Ro">Ro</option>
                </select>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="sex">Sex</label>
                <select className="form-control" id="sex" value={this.state.horse.sex} onChange={this.onHandleChange}>
                  <option value="M">M</option>
                  <option value="Mc">Mc</option>
                  <option value="H">H</option>
                </select>
              </div>
              <div>
                <label htmlFor="sire">Sire</label>
                <input type="text" className="form-control" onChange={this.onHandleChange} id="sire" value={this.state.horse.sire} />
              </div>
              <div>
                <label htmlFor="dam">Dam</label>
                <input type="text" className="form-control" onChange={this.onHandleChange} id="dam" value={this.state.horse.dam} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="stable">Stable</label>
                <div>
                  <Dropdown id="stable" optionLabel="name" filter={true} value={this.state.selectedStable} options={this.state.stables} onChange={this.onStableChangeHandler} placeholder="Select a Stable" />
                  <span>
                    <AddIcon color="secondary" onClick={this.onAddIconClick}></AddIcon>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </Fieldset>
        <button onClick={this.onCancelHandler} className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header="Horse Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
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

        <DialogMaterial
          open={this.state.createStable}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={this.closeStableDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Create Stable"}</DialogTitle>
          <DialogContent>
            {/*<CreateStablePage />*/}
            <DialogContentText id="alert-dialog-slide-description">
              Create Stable
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeStableDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.closeStableDialog} color="primary">
              Save
            </Button>
          </DialogActions>
        </DialogMaterial>

        {
          this.state.isLoading && <Spinner />
        }

      </React.Fragment >
    );
  }
}

export default CreateHorsePage
