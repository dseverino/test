import React from "react";

import { Dropdown } from "primereact/dropdown";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from '@material-ui/core/Button';

const ConfirmationDialogRaw = (props) => {
  const { onClose, open, ...other } = props;
  const [values, setValues] = React.useState({
    name: "",
    startingPosition: "",
    selectedHorse: null
  });
  const [horseRaceDetail, setHorseRaceDetail] = React.useState({
    jockey: ""
  });
  const [horses, setHorses] = React.useState([]);
  const jockeys = props.jockeys.map(jockey => {
    return { label: jockey.name, value: jockey._id }
  })
  const [loading, setLoading] = React.useState(false);

  function handleCancel() {
    //onClose();
    
    console.log(horseRaceDetail)
  }

  function handleOk() {
    onClose(values);
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  }

  function fetchHorses() {
    setLoading(true);
    const requestBody = {
      query: `
          query Horse($name: String){
            horse(name: $name) {
              _id
              name            
              sex
              age            
            }
          }
        `,
      variables: {
        name: values.name
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
        setHorses(resData.data.horse);
        setValues({ ...values, ["selectedHorse"]: null });
      })
      .catch(error => {
        console.log(error)
        setLoading(false);
      })
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Add Horse</DialogTitle>
      <DialogContent dividers>
        <div>
          <TextField
            id="standard-search"
            label="Horse Name"
            type="search"
            margin="normal"
            value={props.value}
            onChange={handleChange('name')}
          >
          </TextField>

          <Button variant="outlined" onClick={fetchHorses}>
            Search
            </Button>
        </div>
        <div>
          {
            horses.length > 0 &&
            <DataTable value={horses} selectionMode="single" selection={values.selectedHorse} onSelectionChange={e => setValues({ ...values, ["selectedHorse"]: e.value })}>
              <Column selectionMode="single" style={{ width: '3em' }} />
              <Column field="name" header="Name" />
              <Column field="age" header="Age" />
              <Column field="sex" header="Sex" />
            </DataTable>
          }
          {
            values.selectedHorse &&
            <Dropdown appendTo={this} options={jockeys} filter={true} value={horseRaceDetail.jockey} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, ["jockey"]: e.value })} />
          }

        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
          </Button>
        <Button onClick={handleOk} color="primary">
          Add
          </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialogRaw;