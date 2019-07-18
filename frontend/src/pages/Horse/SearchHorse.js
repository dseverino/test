import React, { Component } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import AuthContext from "../../context/auth-context";

//import "../pages/Horses.css";

class SearchHorsePage extends Component {
  static contextType = AuthContext

  componentDidMount = () => {
    this.fetchHorses()
  }

  state = {
    creating: false,    
    isLoading: false,
    selectedHorse: null,
    horses: [],
    horse: null
  }
  isActive = true;

  fetchHorses() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          horses {
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
          this.setState({ horses: resData.data.horses, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }


  onHorseChangeHandler = (e) => {
    this.setState({ selectedHorse: e.target.value, horse: null });
    
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleHorse($name: String!) {
          singleHorse(name: $name) {
            _id
            name
            stable {
              name              
            }
          }
        }        
      `,
      variables: {
        name: e.target.value.name
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
        this.setState({ horse: [resData.data.singleHorse], isLoading: false });
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-md-3 mb-3">
          <label htmlFor="horse">Select a Horse</label>
          <Dropdown id="horse" optionLabel="name" filter={true} value={this.state.selectedHorse} options={this.state.horses} onChange={this.onHorseChangeHandler} placeholder="Select a Horse" />
        </div>
        {
          this.state.horse &&
          <DataTable value={this.state.horse} paginator={true} rows={15} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
            totalRecords={10}>
            <Column field="name" header="Name" />
            <Column field="stable.name" header="Stable" />
          </DataTable>
        }

        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default SearchHorsePage
