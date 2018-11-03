import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class DishAddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      name: "",
      description: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { name, description } = this.state;
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add New Menu Item"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <TextField
            id="name"
            label="Menu Item Name"
            margin="normal"
            fullWidth
            value={name}
            onChange={this.handleChange}
            className="inputFields"
          />

          <TextField
            id="description"
            label="Menu Item Description"
            margin="normal"
            fullWidth
            value={description}
            onChange={this.handleChange}
            className="inputFields"
          />
        </EditDialog>
      </div>
    );
  }
  handleSave() {
    const dish = {};
    dish.name = this.state.name;
    dish.description = this.state.description;
    this.setState({
      name: "",
      description: ""
    });
    this.props.handleAddSave(dish);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

DishAddDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleAddSave: PropTypes.func,
  open: PropTypes.bool
};
