import React, { Component } from "react";
import Spinner from "../../components/Spinner/Spinner";

import AuthContext from "../../context/auth-context";

import AppBar from '@material-ui/core/AppBar';
import { Calendar } from 'primereact/calendar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Paper from '@material-ui/core/Paper';

import RaceTabPanel from '../../components/Race/RaceTabPanel'

class Races extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    programDate: "",
    selecteRace: 0,
    races: []
  }

  componentDidMount = () => {

  }

  handleChange = (event, newValue) => {
    this.setState({ selecteRace: newValue })
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
          throw new Error("Failed");
        }
        return result.json();
      })
      .then(resData => {
        if (resData && resData.data.singleProgram) {
          this.setState({ races: resData.data.singleProgram.races, exist: true, isLoading: false });          
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
    const tabs = this.state.races.map(race => {
      return (
        <Tab key={race.event} label={race.event} />
      )
    })
    const RaceTabs = this.state.races.map((race, index) => {      
      return (
        <RaceTabPanel key={index} race={race} value={this.state.selecteRace} index={index} />
      )
    })
    return (
      <React.Fragment>
        <div>
          <strong>Select Program Date: </strong>
          <div className="col-md-3 mb-3">
            <Calendar dateFormat="dd/mm/yy" showIcon={true} id="date" value={this.state.programDate} onChange={this.onProgramDateChange}></Calendar>
          </div>
        </div>
        {
          this.state.races.length > 0 && (
            <React.Fragment>
              <Paper style={{ flexGrow: 1 }}>
                <Tabs value={this.state.selecteRace} onChange={this.handleChange} indicatorColor="primary" textColor="primary" >
                  {tabs}
                </Tabs>
              </Paper>
              { RaceTabs }              
            </React.Fragment>
          )
        }

        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default Races