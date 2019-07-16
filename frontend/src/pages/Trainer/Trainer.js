import React, { Component } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import AuthContext from "../../context/auth-context";

//import "../pages/Horses.css";

class TrainersPage extends Component {
  static contextType = AuthContext

  componentDidMount = () => {
    this.fetchTrainers()
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  state = {
    creating: false,
    trainers: [],
    isLoading: false,
    trainer: {
      name: ''
    }
  }
  isActive = true;

  fetchTrainers() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          trainers {
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
        if (this.isActive) {
          this.setState({ trainers: resData.data.trainers, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  render() {
    return (
      <React.Fragment>
        <DataTable value={this.state.trainers} paginator={true} rows={15} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
          totalRecords={10}>
          <Column field="name" header="Name" />
        </DataTable>
        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default TrainersPage
