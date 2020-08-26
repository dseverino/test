import React from 'react';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import MaterialTable from 'material-table';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

class AddHorseDialog extends React.Component {

  componentDidMount = () => {

    console.log(this.props)
    if (!this.props.horses.length) {
      this.loadHorses()
    }
  }

  loadHorses = () => {
    this.props.loading(true)
    const requestBody = {
      query: `
        query {
          horses {
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
        if (resData.data.horses) {
          this.setState({ horses: resData.data.horses })
          this.props.loading(false)
          this.props.loadHorses(resData.data.horses)
        }
      })
      .catch(error => {
        console.log(error)
        this.props.loading(false)
      })
  }


  state = {
    columns: [
      { title: 'Number', field: 'startingPosition', editable: 'never', width: 10 },
      {
        title: 'Name', field: 'name',
        editComponent: props => (
          <Autocomplete
            type="text"
            freeSolo
            style={{ width: 200 }}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                console.log(newValue)
                setTimeout(() => {

                });
              } else if (newValue && newValue.inputValue) {

              } else {
                this.setState({ value: newValue })
              }
            }}
            getOptionLabel={(option) => {

              // e.g value selected with enter, right from the input
              if (typeof option === 'string') {
                console.log(option)
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderOption={(option) => option.name}
            options={this.state.horses}
            renderInput={(params) => (
              <TextField {...params} />
            )}
          />
        )
      },
      { title: 'Weight', field: 'weight', type: 'numeric' },
      { title: 'Jockey', field: 'jockey' },
      { title: 'Jockey Weight', field: 'jockeyWeight', type: 'numeric' },      
      {
        title: 'Stable',
        field: 'stable',
        lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      },
    ],
    data: this.props.race.horses,
    horses: this.props.horses,
    value: ""
  };


  render() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth={true}
        aria-labelledby="confirmation-dialog-title"
        open={true}
      >        
        <DialogContent dividers>
          <div>
            
            <Button
              variant="contained"
              color="primary"
              style={{ borderRadius: "20px", width: "7em", fontSize: "13px", backgroundColor: 'black' }}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </div>

          <div>
            <MaterialTable
              title="Add Horse"
              columns={this.state.columns}
              data={this.state.data}
              options={{ search: false, sorting: false, draggable: false }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        data.push(newData);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        this.setState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
              }}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.close} color="primary">
            Close
          </Button>

        </DialogActions>
      </Dialog>
    )
  }
}

export default AddHorseDialog;