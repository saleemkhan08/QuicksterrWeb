import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";
import firebase from "firebase/app";
import "firebase/auth";
import CircularProgress from "@material-ui/core/CircularProgress";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./Header.css";
import CurrentOrdersDialog from "../../views/Dashboard/rightPanes/orders/CurrentOrdersDialog";

import { setCurrentOrderRestaurant } from "../../actions/ordersActions";
const dashboardUserList = ["user", "masterAdmin"];
export class HeaderLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { classes, navigation, order } = this.props;
    const showMainPageLinks = ["/"].includes(window.location.pathname);
    return (
      <div>
        <List className={classes.list}>
          {this.getOrdersLink(classes, order)}
          {this.getUserOptions(classes, navigation)}
          {showMainPageLinks
            ? this.getHrefLink(classes, "About", "/#about")
            : ""}
          {showMainPageLinks
            ? this.getHrefLink(classes, "Pricing", "/#pricing")
            : ""}
          {showMainPageLinks
            ? this.getHrefLink(classes, "Contact", "/#contact")
            : ""}
          {navigation.isLoggedIn
            ? this.getLogoutLink(classes, navigation)
            : this.getLoginLink(classes, navigation)}
        </List>
        <CurrentOrdersDialog
          open={this.state.open}
          handleClose={() => this.handleOrderDialog(false)}
        />
      </div>
    );
  }

  getOrdersLink = (classes, order) => {
    const numOrders = Object.keys(order.currentOrderList).length;
    if (numOrders > 0) {
      return (
        <ListItem
          className={classes.listItem}
          onClick={() => this.handleOrderDialog(true)}
        >
          <Link to="#" className={classes.navLink}>
            Your Order
            <span className="badge-count">
              {Object.keys(order.currentOrderList).length}
            </span>
          </Link>
        </ListItem>
      );
    } else {
      if (this.props.order.currentOrderRestaurant)
        this.props.dispatch(setCurrentOrderRestaurant(undefined));
      if (this.state.open) {
        this.setState({
          open: false
        });
      }
    }
  };

  handleOrderDialog = open => {
    this.setState({
      open
    });
  };

  getHrefLink = (classes, name, path) => {
    return (
      <ListItem className={classes.listItem}>
        <a href={path} className={classes.navLink}>
          {name}
        </a>
      </ListItem>
    );
  };

  getUserOptions = (classes, navigation) => {
    if (navigation.isLoggedIn && navigation.user) {
      return dashboardUserList.includes(navigation.user.type) ||
        !navigation.user.restaurantId
        ? this.getLink(classes, "Restaurants", "/restaurants")
        : this.getLink(
            classes,
            "Dashboard",
            "/dashboard/" + navigation.user.restaurantId
          );
    }
  };

  getLink = (classes, name, path) => {
    return (
      <ListItem className={classes.listItem}>
        <Link to={path} className={classes.navLink}>
          {name}
        </Link>
      </ListItem>
    );
  };

  getLoginLink = (classes, navigation) => {
    return (
      <ListItem className={classes.listItem}>
        <Link
          to=""
          className={classes.navLink}
          onClick={() => this.loginWithGoogle(navigation)}
        >
          {navigation.isLoggingLoading ? (
            <CircularProgress size={20} />
          ) : (
            "LOGIN"
          )}
        </Link>
      </ListItem>
    );
  };

  loginWithGoogle = navigation => {
    if (!navigation.isLoggingLoading) {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  };

  getLogoutLink = classes => {
    return (
      <ListItem className={classes.listItem}>
        <Link
          to=""
          className={classes.navLink}
          onClick={() => firebase.auth().signOut()}
        >
          LOGOUT
        </Link>
      </ListItem>
    );
  };
}
const mapStateToProps = state => {
  return {
    navigation: state.NavigationReducer,
    order: state.OrderReducer
  };
};

HeaderLinks.propTypes = {
  classes: PropTypes.object,
  navigation: PropTypes.object,
  order: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(mapStateToProps)(
  withStyles(headerLinksStyle)(HeaderLinks)
);
