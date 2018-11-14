import React from "react";
import EditDialog from "../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
export default class KeywordsEditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      id: "",
      keywords: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  render() {
    const { image } = this.props;
    if (image) {
      if (this.state.id !== image.id) {
        this.setState({
          keywords: image.keywords,
          id: image.id
        });
      }
    }
    const { keywords } = this.state;
    const heading = "Edit Image Keywords";
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading={heading}
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <TextField
            id="keywords"
            label="Keywords"
            margin="normal"
            fullWidth
            value={keywords}
            onChange={this.handleChange}
            className="inputFields"
          />
        </EditDialog>
      </div>
    );
  }
  handleSave() {
    const image = this.props.image;
    image.keywords = this.state.keywords;
    this.props.handleEditSave(image);
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

KeywordsEditDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleEditSave: PropTypes.func,
  open: PropTypes.bool,
  image: PropTypes.object
};
