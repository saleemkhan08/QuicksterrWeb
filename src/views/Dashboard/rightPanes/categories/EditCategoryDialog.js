import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class EditCategoryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      id: "",
      name: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  render() {
    const { category } = this.props;
    if (category) {
      if (this.state.id !== category.id) {
        this.setState({
          name: category.name,
          id: category.id
        });
      }
    }
    const { name } = this.state;
    const heading = "Edit Menu Category Details";
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
    const category = this.props.category;
    category.name = this.state.name;
    this.props.handleEditSave(category);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

EditCategoryDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleEditSave: PropTypes.func,
  open: PropTypes.bool,
  category: PropTypes.object
};
