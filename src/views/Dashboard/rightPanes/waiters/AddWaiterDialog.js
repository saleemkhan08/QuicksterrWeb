import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class AddWaiterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      email: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { email } = this.state;
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add New Waiter"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <TextField
            id="email"
            label="Waiter's Email ID"
            margin="normal"
            fullWidth
            value={email}
            onChange={this.handleChange}
            className="inputFields"
          />
        </EditDialog>
      </div>
    );
  }
  handleSave() {
    this.props.handleAddSave(this.state.email);
    this.setState({
      email: ""
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

AddWaiterDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleAddSave: PropTypes.func,
  open: PropTypes.bool
};
