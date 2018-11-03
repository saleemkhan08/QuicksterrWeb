import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
export class DeleteDialog extends Component {
  render() {
    return (
      <Dialog
        open={this.props.openDialog}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          {this.props.deleteAlertMsg}
        </DialogTitle>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.props.handleDeleteAccepted()}
            color="primary"
            autoFocus
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DeleteDialog.propTypes = {
  handleDeleteAccepted: PropTypes.func,
  deleteAlertMsg: PropTypes.string,
  handleClose: PropTypes.func,
  openDialog: PropTypes.bool
};

export default DeleteDialog;
