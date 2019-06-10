import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"

import AuthPage from "./pages/Auth"
import BookingsPage from "./pages/Bookings"
import HorsesPage from "./pages/Horses"
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

                <Route path="/horses" component={HorsesPage} />
                
                {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                {!this.state.token && <Redirect from="/bookings" to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
