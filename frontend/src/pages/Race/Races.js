import React, { Component } from "react";
import Spinner from "../../components/Spinner/Spinner";

import AuthContext from "../../context/auth-context";

import { Calendar } from 'primereact/calendar';

class BookingsPage extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    programDate: "",
    races: []
  }

  componentDidMount = () => {

  }

  onProgramDateChange = (e) => {
    this.setState({ programDate: e.value, isLoading: true }, () => this.loadProgramRaces());
  }

  loadProgramRaces = () => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleProgram($date: String!) {
          singleProgram(date: $date) {
            races {
              event
              distance
              claimings
              procedences
              horseAge
              spec
              purse
            }
          }
        }
      `,
      variables: {
        date: this.state.programDate
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
        if (resData && resData.data.singleProgram) {
          this.setState({ exist: true, isLoading: false })
        }
        else {
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <strong>Select Program Date: </strong>
          <div className="col-md-3 mb-3">
            <Calendar dateFormat="dd/mm/yy" showIcon={true} id="date" value={this.state.programDate} onChange={this.onProgramDateChange}></Calendar>
          </div>
        </div>
        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default BookingsPage