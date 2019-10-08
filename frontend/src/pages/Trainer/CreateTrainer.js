import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";
import TrainerInput from "../../components/TextFields/TrainerNameInput"

class CreateTrainerPage extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    created: false,
    trainer: {
      name: ""
    }
  }

  modalCancelHandler = (event) => {
    this.setState({ created: false })
    this.setState({
      trainer: {
        name: ""
      }
    })
    document.getElementById("name").focus();
  }
  
  onHandleChange = (value) => {
    let newTrainer = Object.assign({}, this.state.trainer)
    newTrainer["name"] = value
    this.setState({ trainer: newTrainer })
  }

  saveHandler = (event) => {

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateTrainer($trainer: TrainerInput) {
          createTrainer(trainerInput: $trainer) {
            _id
            name
          }
        }
      `,
      variables: {
        trainer: this.state.trainer
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

  onValidateTrainer = (trainer) => {
    if (trainer) {
      this.setState({ trainer: { name: "" } })
    }
  }


  render() {
    return (
      <React.Fragment>
        
        <div>
          <h3>
            Create Trainer
          </h3>
        </div>
        <div>
          <div style={{margin: "20px 0px"}}>
            <TrainerInput id="name" validateTrainer={this.onValidateTrainer} change={this.onHandleChange} name={this.state.trainer.name} />
          </div>

          <button className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={this.saveHandler} className="btn btn-primary">
            Save
          </button>
        </div>

        <Dialog header= "Trainer Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.trainer.name} already exists!
        </Dialog>
        <Dialog header={this.state.trainer.name + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Name: {this.state.trainer.name}
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

export default CreateTrainerPage
