import React from "react";
import { NavLink } from "react-router-dom"

import AuthContext from "../../context/auth-context"

import "./MainNavigation.css"

const mainNavigation = props => (
  <AuthContext.Consumer>
    {({ token, logout }) => (
      <header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>Easy Horse</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            {!token && <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>}
            <li>
              <NavLink to="/horses">Horses</NavLink>
            </li>
            {token && (
              <React.Fragment>
                <li>
                  <NavLink to="/races">Races</NavLink>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </React.Fragment>
            )}
          </ul>
        </nav>
      </header>
    )}
  </AuthContext.Consumer>
)

export default mainNavigation;