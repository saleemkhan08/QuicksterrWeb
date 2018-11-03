import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { closeMessage, customAction } from "../actions/messageActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
export class MessagingComponent extends Component {
  render() {
    const { show, message, action, actionBtnName } = this.props.reducer;
    return (
      <div>
        <Snackbar
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={show}
          onClose={() => this.props.dispatch(closeMessage())}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={message}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={() => {
                this.props.dispatch(closeMessage());
                this.props.dispatch(customAction(action));
              }}
            >
              {actionBtnName}
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="default"
              onClick={() => this.props.dispatch(closeMessage())}
            >
              <CloseIcon style={{ color: "#fff" }} />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reducer: state.MessageReducer
  };
};

MessagingComponent.propTypes = {
  reducer: PropTypes.object,
  dispatch: PropTypes.func
};
export default connect(mapStateToProps)(MessagingComponent);
