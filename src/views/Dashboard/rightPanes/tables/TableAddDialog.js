import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class TableAddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      name: "",
      capacity: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { name, capacity } = this.state;
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add New Table"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <TextField
            id="name"
            label="Table Name"
            margin="normal"
            fullWidth
            value={name}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="capacity"
            label="Capacity"
            value={capacity}
            onChange={this.handleChange}
            type="number"
            fullWidth
            className="inputFields"
            margin="normal"
          />
        </EditDialog>
      </div>
    );
  }
  handleSave() {
    const table = {};
    table.name = this.state.name;
    table.capacity = this.state.capacity;
    this.setState({
      name: "",
      capacity: ""
    });
    this.props.handleAddSave(table);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

TableAddDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleAddSave: PropTypes.func,
  open: PropTypes.bool
};
