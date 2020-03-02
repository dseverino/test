import React, { Component } from "react";
import Spinner from "../../components/Spinner/Spinner";

import AuthContext from "../../context/auth-context";

import { Calendar } from 'primereact/calendar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Paper from '@material-ui/core/Paper';

import RaceTabPanel from '../../components/Race/RaceTabPanel'
import Backdrop from "../../components/Backdrop/Backdrop";

class Races extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    programDate: "",
    selectedRace: 0,
    races: [],
    jockeys: [],
    stables: [],
    trainers: []
  }

  componentDidMount = () => {
    this.fetchJockeys();
    this.fetchStables();
    this.fetchTrainers();
    this.events = [
      "1ra Carrera",
      "2da Carrera",
      "3ra Carrera",
      "4ta Carrera",
      "5ta Carrera",
      "6ta Carrera",
    ]
  }

  handleChange = (event, newValue) => {
    this.setState({ selectedRace: newValue })
  }

  onProgramDateChange = (e) => {
    this.setState({ races: [], programDate: e.value, isLoading: true, selectedRace: 0 }, () => this.loadProgramRaces());
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

  fetchStables = () => {
    //setLoading(true);
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
        this.setState({ stables: resData.data.stables })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
  }

  fetchTrainers = () => {
    //setLoading(true);
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
        this.setState({ trainers: resData.data.trainers })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
  }

  loading = (value) => {
    this.setState({ isLoading: value })
  }

  loadProgramRaces = () => {
    this.setState({ isLoading: true });    
    const requestBody = {
      query: `
        query SingleProgram($date: String!) {
          singleProgram(date: $date) {
            races {
              _id
              event
              distance
              claimings
              procedences
              horseAge
              completed
              spec
              purse
              times {
                quarterMile
                halfMile
                finish
              }
              totalHorses
              hasRaceDetails
              trackCondition
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
                workouts {
                  date
                  jockey {
                    name
                  }
                  time
                  distance
                  briddle
                  trackCondition
                }
                raceDetails {
                  _id                  
                  claiming
                  date
                  discarded
                  distance
                  times {                    
                    quarterMile
                    halfMile
                    thirdQuarter
                    mile
                    finish
                  }
                  finishTime
                  horseMedications
                  horseEquipments
                  jockey{
                    _id
                    name
                    stats
                    trainerStats
                  } 
                  jockeyWeight
                  jockeyChanged
                  stable {
                    name
                    _id
                    stats
                  }
                  trainer {
                    name
                    _id
                    stats
                  }                  
                  raceNumber
                  trackCondition          
                  
                  startingPosition
                  positions{
                    start
                    quarterMile
                    halfMile
                    thirdQuarter
                    mile
                    finish
                  }
                  lengths{
                    quarterMile
                    halfMile
                    thirdQuarter
                    mile
                    finish
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
                  confirmed
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

  addHorseToRace = (raceIndex, raceId, selectedHorse) => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation AddHorse($raceId: ID, $horseId: ID) {
          addHorse(raceId: $raceId, horseId: $horseId) {
            _id
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
              workouts {
                date
                jockey {
                  name
                }
                time
                distance
                briddle
                trackCondition
              }
              raceDetails {
                _id
                startingPosition
                claiming
                horseMedications
                horseEquipments
                jockey{
                  name
                } 
                jockeyWeight
                jockeyChanged
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
                  halfMile
                  thirdQuarter
                  mile
                  finish
                }
                finishTime
                positions{
                  start
                  quarterMile
                  halfMile
                  thirdQuarter
                  mile
                  finish
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
                confirmed
              }
            }
          }
        }
      `,
      variables: {
        raceId: raceId,
        horseId: selectedHorse._id
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
        this.setState((prevState) => {
          const races = prevState.races;
          races[raceIndex] = resData.data.addHorse;
          return { ...prevState, races: races, isLoading: false }
        })
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  hasRaceDetails = (raceIndex) => {
    this.setState((prevState) => {
      const races = prevState.races;
      races[raceIndex]['hasRaceDetails'] = true;
      return { ...prevState, races: races, isLoading: false }
    })
  }

  render() {
    const tabs = this.state.races.map(race => {
      return (
        <Tab key={race._id} label={this.events[race.event - 1]} />
      )
    })
    const RaceTabs = this.state.races.map((race, index) => {
      return (
        <RaceTabPanel loadProgramRaces={this.loadProgramRaces} hasRaceDetails={this.hasRaceDetails} loading={this.loading} programDate={this.state.programDate} horseaddedtorace={this.addHorseToRace} key={race._id} race={race} value={this.state.selectedRace} index={index} jockeys={this.state.jockeys} stables={this.state.stables} trainers={this.state.trainers} />
      )
    });

    return (
      <React.Fragment>
        <div>
          <strong>Select Program Date: </strong>
          <div className="col-md-3 mb-3">
            <Calendar readOnlyInput={true} dateFormat="dd/mm/yy" showIcon={true} id="date" value={this.state.programDate} onChange={this.onProgramDateChange}></Calendar>
          </div>
        </div>
        {
          this.state.races.length > 0 && (
            <React.Fragment>
              <Paper style={{ flexGrow: 1 }}>
                <Tabs value={this.state.selectedRace} onChange={this.handleChange} indicatorColor="primary" textColor="primary" >
                  {tabs}
                </Tabs>
              </Paper>
              {RaceTabs}
            </React.Fragment>
          )
        }

        {
          this.state.isLoading &&
          <React.Fragment>
            <Backdrop />
            <Spinner />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default Races