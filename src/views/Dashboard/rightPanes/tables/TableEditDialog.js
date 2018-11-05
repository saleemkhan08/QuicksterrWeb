import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class TableEditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      id: "",
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
    const { table } = this.props;
    if (table) {
      if (this.state.id !== table.id) {
        this.setState({
          name: table.name,
          id: table.id,
          capacity: table.capacity
        });
      }
    }
    const { name, capacity } = this.state;
    const heading = "Edit Table Details";
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading={heading}
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
    const table = this.props.table;
    table.name = this.state.name;
    table.capacity = this.state.capacity;
    this.props.handleEditSave(table);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

TableEditDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleEditSave: PropTypes.func,
  open: PropTypes.bool,
  table: PropTypes.object
};
