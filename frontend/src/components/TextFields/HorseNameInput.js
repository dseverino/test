import React from "react"

import TextField from '@material-ui/core/TextField';

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import SnackbarSuccess from "../SnackBar/SnackBarSuccess";

const HorseNameInput = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [horse, setHorse] = React.useState({ name: "" })
  const [exist, setExist] = React.useState(false);

  function onHandleChange(e) {
    //setHorse({ name: e.target.value })
    props.change(e)
  }

  function onSnackBarClose(e, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setExist(false);
  }

  function validateHorse() {
    if (!props.name) {
      return false;
    }
    setIsLoading(true)
    const requestBody = {
      query: `
        query SingleHorse($name: String!) {
          singleHorse(name: $name) {
            name
            weight
            age
            color
            sex
            sire
            dam
          }
        }
      `,
      variables: {
        name: props.name
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
        if (resData && resData.data.singleHorse) {
          props.validateHorse(resData.data.singleHorse)
          setHorse( resData.data.singleHorse.name )
          document.getElementById("name").focus();
          setExist(true)
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  }

  return (
    <React.Fragment>
      <div style={{ margin: "20px 0px" }}>        
        <TextField style={{width: "100%"}} id="name" label="Name" variant="outlined" onBlur={validateHorse} value={props.name} onChange={onHandleChange} />
      </div>
      {
        isLoading &&
        (
          <React.Fragment>
            <Spinner />
            <Backdrop />
          </React.Fragment>
        )
      }
      <SnackbarSuccess
        open={exist}
        onClose={onSnackBarClose}
        message={`Horse ${horse} Exists!`}
        variant="warning"
      >
      </SnackbarSuccess>
    </React.Fragment>
  )
}

export default HorseNameInput;