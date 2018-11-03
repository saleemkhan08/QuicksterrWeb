import React from "react";
import EditDialog from "../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class RestaurantEditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      id: "",
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
    const { restaurant } = this.props;
    if (restaurant) {
      if (this.state.id !== restaurant.restaurantId) {
        this.setState({
          name: restaurant.name,
          address: restaurant.address,
          id: restaurant.restaurantId
        });
      }
    }

    const { name, address } = this.state;
    const heading = "Edit Restaurant Details";
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
    const restaurant = this.props.restaurant;
    restaurant.name = this.state.name;
    restaurant.address = this.state.address;
    this.props.handleEditSave(restaurant);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

RestaurantEditDialog.propTypes = {
  handleEditSave: PropTypes.func,
  restaurant: PropTypes.object,
  handleCancel: PropTypes.func,
  open: PropTypes.bool
};
