import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import { Dialog } from 'primereact/dialog';
import Spinner from "../components/Spinner/Spinner";

//import "../pages/Stables.css";

class CreateStablePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    stable: {
      name: ""
    }
  }
  isActive = true;

  startCreateStable = () => {
    this.setState({ exist: true })
  }
  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false, created: false })
    this.setState({
      stable: {
        name: ""
      }
    })
    document.getElementById("name").focus();
  }
  onHandleChange = (e) => {
    let newStable = Object.assign({}, this.state.stable)
    newStable[e.target.id] = e.target.value
    this.setState({ stable: newStable })
  }
  onAgeChangeHandler = (e) => {
    let newStable = Object.assign({}, this.state.stable)
    newStable[e.target.id] = parseInt(e.target.value)
    this.setState({ stable: newStable })
  }
  validateStable = () => {
    if (!this.state.stable.name) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleStable($name: String!) {
          singleStable(name: $name) {
            name
          }
        }
      `,
      variables: {
        name: this.state.stable.name
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
        if (resData && resData.data.singleStable) {
          this.setState({ exist: true});
        }
        this.setState({ isLoading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false });
      })
  }
  saveHandler = (event) => {

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateStable($stable: StableInput) {
          createStable(stableInput: $stable) {
            _id
            name
          }
        }
      `,
      variables: {
        stable: this.state.stable
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
            <input type="text" onBlur={this.validateStable} className="form-control" onChange={this.onHandleChange} id="name" value={this.state.stable.name} />
          </div>
        </form>
        <button className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header= "Stable Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.stable.name} already exists!
        </Dialog>
        <Dialog header={this.state.stable.name + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Name: {this.state.stable.name}
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

export default CreateStablePage
