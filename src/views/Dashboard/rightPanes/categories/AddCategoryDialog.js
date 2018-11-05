import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class AddCategoryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      name: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  render() {
    const { name } = this.state;
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add New Menu Category"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <TextField
            id="name"
            label="Menu Category Name"
            margin="normal"
            fullWidth
            value={name}
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
    this.setState({
      name: ""
    });
    this.props.handleAddSave(dish);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

AddCategoryDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleAddSave: PropTypes.func,
  open: PropTypes.bool
};
