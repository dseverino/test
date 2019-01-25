import React, { Component } from "react";

import "./Auth.css"

class AuthPage extends Component {
  state = {
    isLogin: true
  }
  constructor(props){
    super(props)
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  changeTitle = () => {    
    this.setState((prevState) => {      
      return {isLogin: !prevState.isLogin}
    })
  }

  submitHandler = (event) => {
    event.preventDefault()
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if(email.trim().length === 0 || password.trim().length === 0){
      return;
    }
    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }  
      `
    }
    if(!this.state.isLogin){
      requestBody = {
        query: `
          mutation { 
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
              password
            }
          }
        `
      }
    }
    fetch("http://localhost:3000/graphql",{
      method: 'POST',
      body: JSON.stringify(requestBody),      
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(result =>{
      if(result.status !== 200 && result.status !== 201){        
        throw new Error("Failed")        
      }
      return result.json()
    })
    .then(data => {
      console.log(data.data.login)
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <form onSubmit={this.submitHandler} className="auth-form">
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">          
          <button type="submit">Submit</button>
          <button type="button" onClick={this.changeTitle}>Switch to {this.state.isLogin ? "Signup" : "Login"}</button>
        </div>
      </form>
    );
  }
}

export default AuthPage