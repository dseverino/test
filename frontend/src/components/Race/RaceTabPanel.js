import React, { useState } from "react";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
//import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Modal from "../Modal/Modal";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import Horse from '../../components/Horse/Horse';

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [horses, setHorses] = React.useState([]);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  function handleEntering() {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  }

  function handleCancel() {
    onClose();
  }

  function handleOk() {
    onClose(value);
  }

  function handleChange(event) {
    setValue(event.target.value);
  }

  function fetchHorses() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query Horse($name: String){
          horse() {
            _id
            name            
            sex
            age            
          }
        }
      `,
      variables: {
        name: 
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
        if (this.isActive) {
          this.setState({ horses: resData.data.horses, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
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
          >
          </TextField>

          <Button variant="outlined" onClick={fetchHorses}>
            Search
          </Button>
        </div>
        <div>
          {
            horses.length > 0 &&
            <DataTable value={horses} >
              <Column field="name" header="Name" />
              <Column field="age" header="Age" />
              <Column field="sex" header="Sex" />
            </DataTable>
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
  );
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

const raceTab = props => {
  const horses = props.race.horses.map(horse => {
    return (
      <Horse key={horse._id} horse={horse} style={{ flexGrow: 1 }}/>
    )
  })
  const claimings = props.race.claimings.map(claiming => {
    return "Reclamo RD$" + claiming
  })

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');

  function handleClickListItem() {
    setOpen(true);
  }

  function handleClose(newValue) {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  }

  const onAddHorse = () => {

  }

  return (
    <TabPanel value={props.value} index={props.index}>
      <div>{props.race.distance}. {props.race.procedences} {props.race.horseAge}, {claimings.toString()}. {props.race.spec}</div>
      <span>

      </span>
      <div>Premio RD{formatter.format(props.race.purse)}</div>
      <div>
        <Button color="primary" onClick={handleClickListItem} aria-controls="add-horse">
          Add Horse
        </Button>
      </div>

      { horses }

      <ConfirmationDialogRaw
        id="add-horse"
        open={open}
        keepMounted
        onClose={handleClose}
        value={value}
      />

    </TabPanel>
  )
}



export default raceTab