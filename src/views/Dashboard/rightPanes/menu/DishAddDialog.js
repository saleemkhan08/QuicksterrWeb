import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { showMessage } from "../../../../actions/messageActions";
import { connect } from "react-redux";
class DishAddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      veg: true,
      name: "",
      description: "",
      packingCharge: 0,
      price: "",
      serviceCharge: 0,
      tax: 0,
      variant: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleVegToggle = () => {
    this.setState({
      veg: !this.state.veg
    });
  };

  handleActiveToggle = () => {
    this.setState({
      active: !this.state.active
    });
  };

  render() {
    const {
      active,
      veg,
      name,
      description,
      packingCharge,
      price,
      serviceCharge,
      tax,
      variant
    } = this.state;
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add New Menu Item"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <List className="edit-list">
            <ListItem
              role={undefined}
              dense
              button
              onClick={this.handleActiveToggle}
            >
              <ListItemText primary={active ? "Available" : "Unavailable"} />
              <Checkbox checked={active} tabIndex={-1} disableRipple />
            </ListItem>
            <ListItem
              role={undefined}
              dense
              button
              onClick={this.handleVegToggle}
            >
              <ListItemText primary={veg ? "Veg" : "Non-Veg"} />
              <Checkbox checked={veg} tabIndex={-1} disableRipple />
            </ListItem>
          </List>
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
          <TextField
            id="price"
            label="Price"
            margin="normal"
            fullWidth
            value={price}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="packingCharge"
            label="Packing Charge"
            margin="normal"
            fullWidth
            value={packingCharge}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="serviceCharge"
            label="Service Charge"
            margin="normal"
            fullWidth
            value={serviceCharge}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="tax"
            label="Tax"
            margin="normal"
            fullWidth
            value={tax}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="variant"
            label="Variant"
            margin="normal"
            fullWidth
            value={variant}
            onChange={this.handleChange}
            className="inputFields"
          />
        </EditDialog>
      </div>
    );
  }
  handleSave = () => {
    const dish = {};
    let message = undefined;
    dish["active"] = this.state.active ? "Y" : "N";
    dish["veg"] = this.state.veg ? "Y" : "N";
    dish["name"] = this.state.name;
    dish["description"] = this.state.description;
    dish["price"] = this.state.price;
    dish["packingCharge"] = this.state.packingCharge;
    dish["serviceCharge"] = this.state.serviceCharge;
    dish["tax"] = this.state.tax;
    dish["variant"] = this.state.variant;
    const tempPrice = dish.price.split(",");
    const tempVariant = dish.variant.split(",");

    if (!dish.name) {
      message = "Please enter a valid name..";
    } else if (tempPrice.length !== tempVariant.length) {
      message = "Variants and their price are not matching";
    } else if (!dish.price || dish.price < 0) {
      message = "Please enter a valid price..";
    } else if (dish.packingCharge < 0) {
      message = "Please enter a valid packing charge..";
    } else if (dish.serviceCharge < 0) {
      message = "Please enter a valid service charge..";
    } else if (dish.tax < 0) {
      message = "Please enter a valid tax..";
    } else {
      this.setState({
        active: true,
        veg: true,
        name: "",
        description: "",
        packingCharge: 0,
        price: 0,
        serviceCharge: 0,
        tax: 0,
        variant: ""
      });
      this.props.handleAddSave(dish);
    }
    if (message) {
      this.props.dispatch(showMessage(message));
    }
  };

  handleCancel = () => {
    this.props.handleCancel();
  };
}

DishAddDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleAddSave: PropTypes.func,
  open: PropTypes.bool,
  dispatch: PropTypes.func
};

export default connect()(DishAddDialog);
