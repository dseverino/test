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
    races: [],
    jockeys: []
  }

  componentDidMount = () => {
    this.fetchJockeys();
  }

  handleChange = (event, newValue) => {
    this.setState({ selecteRace: newValue })
  }

  onProgramDateChange = (e) => {
    this.setState({ programDate: e.value, isLoading: true }, () => this.loadProgramRaces());
  }

  fetchJockeys = () => {
    //setLoading(true);
    const requestBody = {
      query: `
        query {
          jockeys {
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
        this.setState({ jockeys: resData.data.jockeys })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
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
              horses {
                _id
                name
                weight
                age
                color
                sex
                sire
                dam
                stable {         
                  _id
                  name
                }
                raceDetails {
                  startingPosition
                  claiming
                  horseMedications
                  horseEquipments
                  jockey{
                    name
                  } 
                  jockeyWeight
                  stable {
                    name
                  }
                  trainer {
                    name
                  }
                  date
                  raceNumber
                  trackCondition          
                  distance
                   times {
                    quarterMile
                  }
                  positions{
                    start
                  }
                  lengths{
                    quarterMile
                  }
                  bet
                  trainingTimes{
                    date
                  }
                  horseWeight
                  claimed
                  claimedBy{
                    name
                  }
                  retired
                  retiredDetails
                  totalHorses
                  horseAge
                  comments
                }
              }
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
        <RaceTabPanel programDate={this.state.programDate} key={index} race={race} value={this.state.selecteRace} index={index} jockeys={this.state.jockeys}/>
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
              {RaceTabs}
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