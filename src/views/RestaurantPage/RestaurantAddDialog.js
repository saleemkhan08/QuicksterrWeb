import React from "react";
import EditDialog from "../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class RestaurantAddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      name: "",
      address: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { name, address } = this.state;
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add Restaurant"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <TextField
            id="name"
            label="Restaurant Name"
            margin="normal"
            fullWidth
            value={name}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="address"
            label="Restaurant Address"
            multiline
            value={address}
            rowsMax="4"
            fullWidth
            className="inputFields"
            margin="normal"
            onChange={this.handleChange}
          />
        </EditDialog>
      </div>
    );
  }
  handleSave() {
    const restaurant = {};
    restaurant.name = this.state.name;
    restaurant.address = this.state.address;
    this.setState({
      name: "",
      address: ""
    });
    this.props.handleAddSave(restaurant);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

RestaurantAddDialog.propTypes = {
  handleAddSave: PropTypes.func,
  handleCancel: PropTypes.func,
  open: PropTypes.bool
};
