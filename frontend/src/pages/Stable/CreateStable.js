import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
import Spinner from "../../components/Spinner/Spinner";
import SaveStableButton from "../../components/Buttons/SaveStableButton";
import StableInput from "../../components/TextFields/StableNameInput";
import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";

import { Dialog } from 'primereact/dialog';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

//import "../pages/Stables.css";

class CreateStablePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    show: false,
    stable: {
      name: ""
    }
  }
  isActive = true;

  startCreateStable = () => {
    this.setState({ exist: true })
  }
  modalCancelHandler = (event) => {
    //this.setState({ creating: false, exist: false, created: false })
    this.setState({
      stable: {
        name: ""
      }
    })
    document.getElementById("name").focus();
  }
  
  onHandleChange = (value) => {
    let newStable = Object.assign({}, this.state.stable)
    newStable["name"] = value
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
          this.setState({ exist: true });
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
        this.setState({ created: true, isLoading: false })
      })
      .catch(error => {
        console.log(error);
      })
  }

  onCancelHandler = (event) => {
    this.setState(prevState => {
      return {...prevState, stable: {name: ""} }
    })
  }

  savedStable =(stable) => {
    this.setState({ created: true });
  }

  onValidateStable = (stable) => {
    if(stable){
      this.setState({stable: {name: ""}})
    }
  }

  onSnackBarClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    //this.setState({ created: true, stable: { name: "" } });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3>
            Create Stable
          </h3>
        </div>
        <div>
          {/*<div style={{margin: "4px 0px"}}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" onBlur={this.validateStable} value={this.state.stable.name} onChange={this.onHandleChange} />
          </div>*/}
          <StableInput id="name" validateStable={this.onValidateStable} change={this.onHandleChange} name={this.state.stable.name}/>

          <Button onClick={this.onCancelHandler}>
            Cancel
          </Button>
          
          <SaveStableButton stable={this.state.stable} savedStable={this.savedStable}></SaveStableButton>
        </div>
        
        <SnackbarSuccess
          open={this.state.created}
          onClose={this.onSnackBarClose}
          message="Stable Created!"
          variant={"success"}
        >
        </SnackbarSuccess>
        
        {
          this.state.isLoading && <Spinner />
        }
        
      </React.Fragment >
    );
  }
}

export default CreateStablePage
