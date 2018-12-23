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
      gstNumber: "",
      bankAccountNumber: "",
      ifscCode: "",
      address: "",
      phoneNumber: "",
      email: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const {
      name,
      gstNumber,
      bankAccountNumber,
      ifscCode,
      address,
      phoneNumber,
      email
    } = this.state;
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
            id="gstNumber"
            label="GST Number"
            value={gstNumber}
            rowsMax="4"
            fullWidth
            className="inputFields"
            margin="normal"
            onChange={this.handleChange}
          />
          <TextField
            id="bankAccountNumber"
            label="Bank account number"
            value={bankAccountNumber}
            rowsMax="4"
            fullWidth
            className="inputFields"
            margin="normal"
            onChange={this.handleChange}
          />
          <TextField
            id="ifscCode"
            label="IFSC Code"
            value={ifscCode}
            rowsMax="4"
            fullWidth
            className="inputFields"
            margin="normal"
            onChange={this.handleChange}
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
          <TextField
            id="phoneNumber"
            label="Phone Number"
            multiline
            value={phoneNumber}
            rowsMax="4"
            fullWidth
            className="inputFields"
            margin="normal"
            onChange={this.handleChange}
          />
          <TextField
            id="email"
            label="Email"
            value={email}
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
    restaurant.gstNumber = this.state.gstNumber;
    restaurant.bankAccountNumber = this.state.bankAccountNumber;
    restaurant.ifscCode = this.state.ifscCode;
    restaurant.address = this.state.address;
    restaurant.phoneNumber = this.state.phoneNumber;
    restaurant.email = this.state.email;

    this.setState({
      name: "",
      gstNumber: "",
      bankAccountNumber: "",
      ifscCode: "",
      address: "",
      phoneNumber: "",
      email: ""
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
