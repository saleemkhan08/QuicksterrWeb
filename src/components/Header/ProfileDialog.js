import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import {
  closeProfileDialog,
  MASTER_ADMIN,
  WAITER,
  CHEF,
  RESTAURANT_ADMIN,
  logout
} from "../../actions/navigationActions";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
class ProfileDialog extends React.Component {
  handleClose = () => {
    this.props.dispatch(closeProfileDialog());
  };

  render() {
    const { openProfileDialog, user } = this.props.navigation;
    const userType = this.getUserTypeText(user);
    return (
      <Dialog onClose={this.handleClose} open={openProfileDialog}>
        <IconButton
          key="close"
          aria-label="Close"
          color="default"
          className="close-dialog-btn"
          onClick={this.handleClose}
        >
          <CloseIcon />
        </IconButton>
        <div className="profile-details-container">
          <img className="profile-photo" alt={user.name} src={user.photoUrl} />
          <h3 className="profile-name"> {user.name}</h3>
          <h4 className="profile-email"> {userType} </h4>
          <div className="logout-btn-container">
            <Button
              className="logout-btn"
              variant="outlined"
              color="secondary"
              onClick={() => this.props.dispatch(logout())}
            >
              Logout
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  getUserTypeText = user => {
    const { currentRestaurant } = this.props.restaurant;
    const restaurantName = currentRestaurant
      ? currentRestaurant.name + " - "
      : "";
    switch (user.type) {
      case MASTER_ADMIN:
        return "Quicksterr - Admin";
      case WAITER:
        return restaurantName + "Waiter";
      case CHEF:
        return restaurantName + "Chef";
      case RESTAURANT_ADMIN:
        return restaurantName + "Admin";
      default:
        return user.email;
    }
  };
}

ProfileDialog.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  restaurant: PropTypes.object
};

const mapStateToProps = state => {
  return {
    navigation: state.NavigationReducer,
    restaurant: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(ProfileDialog);
