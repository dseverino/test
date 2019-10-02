import React from "react"


function saveHandler (event) {

  console.log("button pressed")

  /*this.setState({ isLoading: true })
  const requestBody = {
    query: `
      mutation CreateStable($stable: StableInput) {
        createStable(stableInput: $stable) {
          _id
          name
        }
      }
    `,
    variables: {
      stable: this.state.stable
    }
  }

  const token = this.context.token

  fetch("http://localhost:3000/graphql", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      "Authorization": `Bearer ${token}`,
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
      /*this.setState((prevState) => {
        return { isLoading: false }
      })
      this.setState({ created: true })

    })
    .catch(error => {
      console.log(error);
    })*/
}

const SaveStableButton = props => {
  return (
    <button onClick={saveHandler} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary" style={{marginLeft: 0}}>
      Save
    </button>
  )
}

export default SaveStableButton;