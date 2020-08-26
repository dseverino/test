import React from 'react';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import { Dropdown } from "primereact/dropdown";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


class CreateHorseDialog extends React.Component {

  closeHorseDialog = () => {
    this.props.open = false
    console.log(this.props)
  }
  stables = this.props.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  });

  state = {
    name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native"
  }

  submit = (e, f) => {

    e.preventDefault();
    console.log(e.target.name.value)
    console.log(e.target)
    const { name } = e.target
    console.log(name)
    console.log(e.target.elements)
  }

  render() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={this.props.open}
      >
        <DialogTitle id="confirmation-dialog-title">Create Horse</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>

            <div style={{ margin: "20px 0px" }}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input value={this.state.name} onChange={e => this.setState({ name: e.target.value })} style={{ width: "100%" }} label="Name" variant="outlined" />
            </div>
            <div>
              <TextField
                name="weight"
                type="number"
                variant="outlined"
                label="Weight"
                value={this.state.weight}
                onChange={e => this.setState({ weight: parseInt(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
                }}
              />
            </div>
            <div>
              <label htmlFor="age">Age</label>
              <select className="form-control" onChange={e => this.setState({ age: parseInt(e.target.value) })} name="age" value={this.state.age}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
              </select>
            </div>
            <div>
              <label htmlFor="color">Color</label>
              <select className="form-control" onChange={e => this.setState({ color: e.target.value })} name="color" value={this.state.color}>
                <option value="Z">Z</option>
                <option value="Zo">Zo</option>
                <option value="A">A</option>
                <option value="R">R</option>
                <option value="Ro">Ro</option>
              </select>
            </div>
            <div>
              <RadioGroup
                aria-label="procedence"
                name="procedence"
                value={this.state.procedence}
                onChange={(e) => this.setState({ procedence: e.target.value })}
              >
                <FormControlLabel
                  value="native"
                  control={<Radio color="primary" />}
                  label="Native"
                />
                <FormControlLabel
                  value="imported"
                  control={<Radio color="primary" />}
                  label="Imported"
                />
              </RadioGroup>
            </div>
          </div>
          <div style={{ margin: "0px 10px" }}>
            <div>
              <label htmlFor="sex">Sex</label>
              <select className="form-control" name="sex" value={this.state.sex} onChange={e => this.setState({ sex: e.target.value })}>
                <option value="M">M</option>
                <option value="Mc">Mc</option>
                <option value="H">H</option>
              </select>
            </div>
            <div>
              <TextField label="Sire" name="sire" onChange={e => this.setState({ sire: e.target.value })} value={this.state.sire} margin="normal" variant="outlined" />
            </div>
            <div>
              <TextField label="Dam" name="dam" onChange={e => this.setState({ dam: e.target.value })} value={this.state.dam} margin="normal" variant="outlined" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="stable">Stable</label>
              <div>
                <Dropdown filter={true} value={this.state.stable} options={this.stables} onChange={(e) => this.setState({ stable: e.target.value })} placeholder="Select a Stable" />
                <span>
                  <AddIcon color="secondary" onClick={() => { this.props.addDialog("stable") }}></AddIcon>
                </span>
              </div>
            </div>

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.close("horse")} >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default CreateHorseDialog;


