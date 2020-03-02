import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth/Auth";
import RacesPage from "./pages/Race/Races";
import HorsesPage from "./pages/Horse/Horses";
import SearchHorsePage from "./pages/Horse/SearchHorse";
import CreateHorsePage from "./pages/Horse/CreateHorse";
import AddHorseStable from "./pages/Horse/AddHorseStable";
import CreateJockeyPage from "./pages/Jockey/CreateJockey";
import JockeysPage from "./pages/Jockey/Jockey";
import StablePage from "./pages/Stable/Stable";
import CreateStablePage from "./pages/Stable/CreateStable";
import SearchStablePage from "./pages/Stable/SearchStable";
import StableAddTrainerPage from "./pages/Stable/AddTrainerStable"
import TrainerPage from "./pages/Trainer/Trainer";
import CreateTrainerPage from "./pages/Trainer/CreateTrainer";
import CreateProgramPage from "./pages/Program/CreateProgram";
import CreateRacePage from "./pages/Race/CreateRace";
import CreateWorkoutPage from "./pages/Workout/CreateWorkout";

import MainNavigation from "./components/Navigation/MainNavigation"

import AuthContext from "./context/auth-context";

import './App.css';

class App extends Component {
  state = {
    userId: null,
    token: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ userId: userId, token: token })
  }
  logout = () => {
    this.setState({ userId: null, token: null })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/horses" exact />}

                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                {this.state.token && <Redirect from="/auth" to="/horses" exact />}
                <Route path="/createprogram" component={CreateProgramPage} />
                <Route path="/horses" component={HorsesPage} />
                <Route path="/createhorse" component={CreateHorsePage} />
                <Route path="/addhorsestable" component={AddHorseStable} />
                <Route path="/horseDetails" component={SearchHorsePage} />
                
                <Route path="/jockeys" component={JockeysPage} />
                <Route path="/createjockey" component={CreateJockeyPage} />
                <Route path="/stable" component={StablePage} />
                <Route path="/createstable" component={CreateStablePage} />
                <Route path="/SearchStable" component={SearchStablePage} />
                <Route path="/addtrainertostable" component={StableAddTrainerPage} />
                <Route path="/trainer" component={TrainerPage} />
                <Route path="/createtrainer" component={CreateTrainerPage} />
                
                <Route path="/races" component={RacesPage} />
                <Route path="/createrace" component={CreateRacePage} />

                <Route path="/createworkout" component={CreateWorkoutPage} />
                
                
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
