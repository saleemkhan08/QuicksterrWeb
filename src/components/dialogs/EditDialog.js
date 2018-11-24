import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./dialogs.css";
import PropTypes from "prop-types";
export default class EditDialog extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleCancel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.props.heading}</DialogTitle>
          <div className="editDialogContainer">{this.props.children}</div>
          <DialogActions className="dialogActions">
            <Button onClick={this.props.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

EditDialog.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
  handleCancel: PropTypes.func,
  handleSave: PropTypes.func,
  open: PropTypes.bool,
  hideSave: PropTypes.bool
};
