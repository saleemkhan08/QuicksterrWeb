import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class DishEditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      id: "",
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
    const { dish } = this.props;
    if (dish) {
      if (this.state.id !== dish.id) {
        this.setState({
          name: dish.name,
          id: dish.id,
          description: dish.description
        });
      }
    }
    const { name, description } = this.state;
    const heading = "Edit Menu Item Details";
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
    const dish = this.props.dish;
    dish.name = this.state.name;
    dish.description = this.state.description;
    this.props.handleEditSave(dish);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

DishEditDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleEditSave: PropTypes.func,
  open: PropTypes.bool,
  dish: PropTypes.object
};
